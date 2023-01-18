import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { defer } from "@remix-run/node";

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
  return defer({
    critical,
    lazy,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <section>Critical Data: {JSON.stringify(data.critical)}</section>
      <Suspense fallback={<section>Lazy Data: Loading....</section>}>
        <Await resolve={data.lazy} errorElement={<div>Loading...</div>}>
          {(value) => <section>Lazy Data: {JSON.stringify(value)}</section>}
        </Await>
      </Suspense>
    </div>
  );
}
