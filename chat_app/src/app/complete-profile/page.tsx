'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import Image from 'next/image';

export default function CompleteProfile() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user && user.publicMetadata?.formCompleted) {
      router.push("/");
    }
  }, [isLoaded, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !user || !firstName || !lastName) {
      console.error("Missing required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/v1/addUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          firstName,
          lastName,
          bio
        })
      });

      const data = await res.json();

      if (res.status === 200) {
      await user.reload();
        router.push('/');
      } else {
        console.error('Error saving user:', data);
      }
    } catch (error) {
      console.error('Failed to update metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <Image src="/login.svg" alt="Login" width={160} height={160} className="mb-4" />

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold text-center">Complete your profile</h2>

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />
        <textarea
          placeholder="Enter your bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2 disabled:opacity-70"
          disabled={loading}
        >
          {loading && <Loader className="animate-spin w-4 h-4" />}
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
