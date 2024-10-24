"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBook } from "react-icons/fa";
import { usePathname } from "next/navigation";
type CardProps = {
  subjectFullname: string;
  description: string;
  subjectcode: string;
  credit: number;
  pdflink: string;
  _id: string;
};

const Card: React.FC<CardProps> = ({
  subjectFullname,
  description,
  subjectcode,
  credit,
  pdflink,
  _id
}) => {
  const router = useRouter();
  const pathname = usePathname();
  // console.log(pathname)
  const goToSubjectPage = () => {
    const route = `${pathname}/${subjectFullname
      .toLowerCase()
      .replace(/ /g, "-")}?id=${_id}`;
    router.push(route);
  };

  return (
    <div
      // onClick={handleClick}
      className="flex subject-card px-5 rounded-xl p-4 shadow-lg sm:m-5 my-3 cursor-pointer h-[190px] lg:w-5/12 w-full"
    >
      <div className="flex w-28 mr-6 rounded-xl items-center  justify-center ">
        <div className="rounded-full flex items-center justify-center bg-white p-5">
          <span className="text-3xl font-bold text-purple-500">
            <FaBook />
          </span>
        </div>
      </div>
      <div className="text-start px-4">
        <h2 className="sm:text-2xl text-xl font-bold text-white">
          {subjectFullname}
        </h2>
        <p className="text-white sm:text-base text-[15px]">{description}</p>
        <div className="sm:mt-4 mt-2">
          <p className="text-white">Code: {subjectcode}</p>
          <p className="text-white">Credit: {credit}</p>
          <div
            onClick={goToSubjectPage}
            // href={pdflink}
            className="text-blue-300 underline"
            // target="_blank"
            rel="noopener noreferrer"
          >
            View Resources
          </div>
        </div>
      </div>
    </div>
  );
};

const fetchNotes = async (
  year: number,
  sem: number | string
): Promise<CardProps[]> => {
  const url =
    typeof sem === "string"
      ? `/api/note/view-note?year=${year}&scheme=${sem}`
      : `/api/note/view-note?year=${year}&sem=${sem}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  const data = await response.json();
  return data.notes;
};

const ThirdSemSubject = ({
  year,
  sem,
}: {
  year: number;
  sem: number | string;
}) => {
  const [notes, setNotes] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotes = await fetchNotes(year, sem); // Fetch notes by year and semester
        setNotes(fetchedNotes);
        console.log(fetchedNotes);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetNotes();
  }, [year, sem]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-wrap justify-center items-center">
      {notes && notes.length > 0 ? (
        notes.map((data, index) => (
          <Card
            _id={data._id}
            key={index}
            subjectFullname={data.subjectFullname}
            description={data.description}
            subjectcode={data.subjectcode}
            credit={data.credit}
            pdflink={data.pdflink}
          />
        ))
      ) : (
        <p>No notes found for this semester.</p>
      )}
    </div>
  );
};

export default ThirdSemSubject;
