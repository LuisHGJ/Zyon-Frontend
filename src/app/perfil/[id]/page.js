"use client"; 

import ProfileScreen from '@/components/ProfileScreen/ProfileScreen';
import { useParams } from 'next/navigation';

export default function DynamicProfilePage() {
    const params = useParams();
    const userId = params.id; 

    return <ProfileScreen targetId={userId} />; 
}