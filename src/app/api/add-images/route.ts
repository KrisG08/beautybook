import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const categoryImages: Record<string, string[]> = {
  hair: [
    'https://images.unsplash.com/photo-1560066984-138deb2ed1e3?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1600966843904-f4a6a7b93d04?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=400&h=250&fit=crop',
  ],
  nails: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1632345031435-8727f6897d52?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1602808163703-16e63b94f9f1?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614b5a?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1601055903647-ddf1ee9701b7?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1606189924447-41d0071c3a3c?w=400&h=250&fit=crop',
  ],
  skin: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1562982074-d5b87c2d3ad6?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=250&fit=crop',
  ],
  massage: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1591343395082-e120087494b4?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1598877909680-9c74cb6648c5?w=400&h=250&fit=crop',
  ],
  makeup: [
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1522337660859-02fb330b2a91?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1503236823255-9435758c985d?w=400&h=250&fit=crop',
  ],
  brows: [
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1522337660859-02fb330b2a91?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1503236823255-9435758c985d?w=400&h=250&fit=crop',
  ],
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    
    if (secret !== 'add-images-2024') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const businesses = await prisma.business.findMany({
      where: { status: 'approved' },
    });

    const results: string[] = [];

    for (const business of businesses) {
      const images = categoryImages[business.category];
      if (images && images.length > 0) {
        const shuffledImages = shuffleArray(images);
        const imageIndex = businesses.indexOf(business) % shuffledImages.length;
        
        await prisma.business.update({
          where: { id: business.id },
          data: { imageUrl: shuffledImages[imageIndex] },
        });
        
        results.push(`Updated: ${business.name} with image`);
      }
    }

    return NextResponse.json({ 
      message: 'Images added successfully!', 
      results 
    });
  } catch (error) {
    console.error('Add images error:', error);
    return NextResponse.json({ 
      error: 'Failed to add images', 
      details: String(error) 
    }, { status: 500 });
  }
}