import Image from "next/image";

export default function Home() {
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

      {/* Form */}
      <form className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Name Fields */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="John"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
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
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>

        {/* Date of Birth Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
            Date of Birth
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dob"
            type="date"
            required
          />
        </div>

        {/* File Upload Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Upload File (PDF or PNG only)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="file"
            type="file"
            accept=".pdf,.png"
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
