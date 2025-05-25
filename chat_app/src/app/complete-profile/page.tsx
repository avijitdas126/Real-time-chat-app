'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CompleteProfile() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !user || !firstName || !lastName) {
      console.error("Missing required fields");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/v1/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          firstName,
          lastName,
          bio
        })
      });

      const data = await res.json();

      if (res.status === 200 ) {
        router.push('/');
      } else {
        console.error('Error saving user:', data);
      }
    } catch (error) {
      console.error('Failed to update metadata:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Complete your profile</h2>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Enter your bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </form>
  );
}
