'use client';

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      await response.json();
      setSuccess(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-gray-50">
      {/* Logo and Title */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-8">
        <Image
          src="/images/AgilityAutomation-logo.webp"
          alt="Agility Automation Logo"
          width={400}
          height={126}
          priority
          className="mb-6"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Developer Exercise</h1>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="w-full max-w-2xl mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="w-full max-w-2xl mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          User created successfully!
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Name Fields */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="first_name"
              name="user[first_name]"
              type="text"
              placeholder="John"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="last_name"
              name="user[last_name]"
              type="text"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="user[email]"
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>

        {/* Date of Birth Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_of_birth">
            Date of Birth
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date_of_birth"
            name="user[date_of_birth]"
            type="date"
            required
          />
        </div>

        {/* File Upload Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uploaded_file">
            Upload File (PDF or Image only)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="uploaded_file"
            name="user[uploaded_file]"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
