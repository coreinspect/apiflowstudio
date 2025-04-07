"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage("Thanks! We'll notify you when we launch.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        (error as Error).message || "Failed to submit. Please try again."
      );
    }
  };

  return (
    <div className="bg-white grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center max-w-2xl">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/apiflowstudiologo.png"
            alt="Logo"
            width={350}
            height={150}
          />

          <p className="text-xl sm:text-2xl font-medium text-blue-700 mt-2">
            Visualize Your API Flows Like Never Before
          </p>
        </div>

        <p className="text-gray-800 text-lg max-w-xl">
          A collaborative platform for devs, PMs, and analysts to design
          use-case diagrams, attach API endpoints, and map request-response
          flows — all in one place.
        </p>

        <div className="w-full max-w-md mt-6">
          <p className="mb-4 font-medium text-blue-600">
            Be the first to know when we launch.
          </p>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className={`${
                  status === "loading"
                    ? "bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-medium py-3 px-6 rounded-lg transition-colors`}
              >
                {status === "loading" ? "Sending..." : "Notify Me"}
              </button>
            </div>
          </form>

          {message && (
            <p
              className={`mt-3 text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="flex gap-6 mt-6">
          <a
            href="#"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            [Twitter]
          </a>
          <a
            href="#"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            [GitHub]
          </a>
          <a
            href="#"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            [LinkedIn]
          </a>
        </div>
      </main>

      <footer className="row-start-3 text-center text-gray-600 text-sm mt-12">
        © 2025 API Flow Studio
      </footer>
    </div>
  );
}
