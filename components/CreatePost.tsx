'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, Image as ImageIcon, Video, Type, Send, Loader2 } from 'lucide-react';

type UploadType = 'text' | 'image' | 'video';

interface CreatePostProps {
  onPostCreated?: () => void;
}

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
      alert(`文件太大！${postType === 'video' ? '视频' : '图片'}最大 ${maxSize / 1024 / 1024}MB`);
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
      alert('请先登录！');
      return;
    }

    if (!content.trim() && !selectedFile) {
      alert('请输入内容或上传文件！');
      return;
    }

    setIsUploading(true);

    try {
      let mediaUrl = '';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const cloudinaryUrl = postType === 'video'
          ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
          : `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

        const uploadResponse = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('文件上传失败');
        }

        const uploadData = await uploadResponse.json();
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
        throw new Error(data.error || '发布失败');
      }

      setContent('');
      setSelectedFile(null);
      setPreviewUrl('');
      setIsOpen(false);
      alert('发布成功！+10积分 🎉');

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('发布失败:', error);
      alert(error instanceof Error ? error.message : '发布失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          登录后即可发布内容
        </p>
        <a
          href="/api/auth/signin"
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
        >
          立即登录
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
            <span className="font-medium">分享你的学习动态...</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              创建帖子
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
              文字
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
              图片
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
              视频
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的学习心得..."
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
                    accept={postType === 'image' ? 'image/*' : 'video/*'}
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
                      点击上传{postType === 'image' ? '图片' : '视频'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {postType === 'image' ? '支持 JPG, PNG, GIF (最大10MB)' : '支持 MP4, MOV (最大100MB)'}
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
                上传中...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                发布 (+10积分)
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            发布内容即可获得 10 积分奖励
          </p>
        </div>
      )}
    </>
  );
}
