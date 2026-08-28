'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Video, Type, Send, Loader2 } from 'lucide-react';

type UploadType = 'text' | 'image' | 'video';

interface CreatePostProps {
  onPostCreated?: () => void;
}

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm']);

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [postType, setPostType] = useState<UploadType>('text');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = postType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File too large! ${postType === 'video' ? 'Videos' : 'Images'} must be no larger than ${maxSize / 1024 / 1024}MB.`);
      e.target.value = '';
      return;
    }

    const allowedTypes = postType === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.has(file.type)) {
      alert(
        postType === 'video'
          ? 'Unsupported video format. Please use MP4, MOV, or WebM.'
          : 'Unsupported image format. Please use JPG, PNG, GIF, or WebP.'
      );
      e.target.value = '';
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!session) {
      alert('Please sign in first.');
      return;
    }

    if (!content.trim() && !selectedFile) {
      alert('Please enter some content or upload a file.');
      return;
    }

    setIsUploading(true);

    try {
      let mediaUrl = '';

      if (selectedFile) {
        const resourceType = postType === 'video' ? 'video' : 'image';
        const signatureResponse = await fetch('/api/upload/signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resourceType }),
        });

        const signatureData = await signatureResponse.json();
        if (!signatureResponse.ok) {
          throw new Error(signatureData.error || 'Unable to prepare the file upload.');
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', String(signatureData.timestamp));
        formData.append('signature', signatureData.signature);
        formData.append('folder', signatureData.folder);
        formData.append('allowed_formats', signatureData.allowedFormats);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`;
        const uploadResponse = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('File upload failed.');
        }

        const uploadData = await uploadResponse.json();
        if (typeof uploadData.secure_url !== 'string') {
          throw new Error('The upload service did not return a valid file URL.');
        }
        mediaUrl = uploadData.secure_url;
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          mediaUrl,
          mediaType: selectedFile ? postType : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish the post.');
      }

      setContent('');
      setSelectedFile(null);
      setPreviewUrl('');
      setIsOpen(false);
      alert('Post published successfully! +10 points 🎉');

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert(error instanceof Error ? error.message : 'Failed to publish the post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Sign in to publish content
        </p>
        <a
          href="/api/auth/signin"
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl transition-all border-2 border-dashed border-amber-300 dark:border-amber-600"
        >
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
            <Type className="w-5 h-5" />
            <span className="font-medium">Share your learning update...</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Create Post
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPostType('text')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                postType === 'text'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Type className="w-5 h-5 mx-auto mb-1" />
              Text
            </button>
            <button
              onClick={() => setPostType('image')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                postType === 'image'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <ImageIcon className="w-5 h-5 mx-auto mb-1" />
              Image
            </button>
            <button
              onClick={() => setPostType('video')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                postType === 'video'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Video className="w-5 h-5 mx-auto mb-1" />
              Video
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your learning experience..."
            className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 resize-none"
            rows={4}
            maxLength={5000}
          />

          {(postType === 'image' || postType === 'video') && (
            <div className="mb-4">
              {!selectedFile ? (
                <label className="block">
                  <input
                    type="file"
                    accept={postType === 'image' ? 'image/jpeg,image/png,image/gif,image/webp' : 'video/mp4,video/quicktime,video/webm'}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500 transition-colors">
                    {postType === 'image' ? (
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    ) : (
                      <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    )}
                    <p className="text-gray-600 dark:text-gray-300">
                      Click to upload {postType === 'image' ? 'an image' : 'a video'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {postType === 'image' ? 'JPG, PNG, GIF, WebP (max 10MB)' : 'MP4, MOV, WebM (max 100MB)'}
                    </p>
                  </div>
                </label>
              ) : (
                <div className="relative">
                  {postType === 'image' ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-64 rounded-xl"
                    />
                  )}
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Remove selected file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isUploading || (!content.trim() && !selectedFile)}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Publish (+10 points)
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            Earn 10 points for publishing content
          </p>
        </div>
      )}
    </>
  );
}
