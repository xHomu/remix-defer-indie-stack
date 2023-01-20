import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { defer } from "@remix-run/node";
import { getNoteTitle } from "~/models/note.server";

function getCritical(): Promise<{ message: string }> {
  return new Promise((r) =>
    setTimeout(() => r({ message: "Immediate Data" }), 1000)
  );
}
function getLazy(): Promise<{ message: string }> {
  return new Promise((r) =>
    setTimeout(() => r({ message: "Slow Data" }), 4000)
  );
}

export const loader = async () => {
  const critical = await getCritical();
  const lazy = getLazy();
  const note = await getNoteTitle({ title: "My first note" });
  return defer({
    critical,
    lazy,
    note,
    lazynote: getNoteTitle({ title: "My first note" }),
  });
};

export default function Index() {
  const { critical, lazy, note, lazynote } = useLoaderData<typeof loader>();
  return (
    <div>
      <section>Critical Data: {critical.message}</section>
      <Suspense fallback={<section>Lazy Data: Loading....</section>}>
        <Await resolve={lazy} errorElement={<div>Loading...</div>}>
          {(lazy) => (
            <section>This shows that defer works: {lazy.message}</section>
          )}
        </Await>
      </Suspense>
      <section>Note: {JSON.stringify(note)}</section>
      <Suspense fallback={<section>Lazy Data: Loading....</section>}>
        <Await resolve={lazynote} errorElement={<div>Loading...</div>}>
          {(lazy) => (
            <section>
              This shows that teleporting a prisma promise doesn't work:{" "}
              {JSON.stringify(lazynote)}
            </section>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
