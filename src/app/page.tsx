import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-center items-center w-full h-screen max-h-[85vh]">
      <section className="flex flex-col lg:flex-row justify-center items-center w-full text-center px-10 gap-8">
        <Link
          href={"/streamer"}
          className="bg-orange-100 hover:bg-orange-200 hover:font-medium w-full border border-gray-300 shadow-sm rounded-md py-2 max-w-[250px]"
        >
          Iniciar Stream
        </Link>
        <Link
          href={"/viewer"}
          className="bg-amber-100 hover:bg-amber-200 hover:font-medium  w-full border border-gray-300 shadow-sm rounded-md py-2 max-w-[250px]"
        >
          Ver Stream
        </Link>
      </section>
    </main>
  );
}
