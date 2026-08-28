import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const ALLOWED_RESOURCE_TYPES = new Set(['image', 'video']);
const CLOUDINARY_FOLDER = 'english-learning-circle';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary server configuration is incomplete');
      return NextResponse.json({ error: '上传服务配置不完整' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const resourceType = typeof body.resourceType === 'string' ? body.resourceType : '';

    if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
      return NextResponse.json({ error: '不支持的上传类型' }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=${CLOUDINARY_FOLDER}&timestamp=${timestamp}`;
    const signature = createHash('sha1')
      .update(`${paramsToSign}${apiSecret}`)
      .digest('hex');

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder: CLOUDINARY_FOLDER,
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('生成上传签名失败:', error);
    return NextResponse.json({ error: '生成上传签名失败' }, { status: 500 });
  }
}
