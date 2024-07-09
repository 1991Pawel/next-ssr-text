import Head from "next/head";

async function getData({ params: { slug } }) {
  if (!slug) return;
  // const slug = params.id;

  const res = await fetch(
    `https://new-agnes.tdy-apps.com/wp-json/wp/v2/posts?slug=${slug}`
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export async function generateMetadata({ params }) {
  const data = await getData({
    params: {
      slug: params.slug,
    },
  });

  return {
    title: data[0].title.rendered,
    openGraph: {
      images: [data[0].fimg_url],
    },
  };
}

export const revalidate = 3600;

export default async function Page({ params }) {
  const data = await getData({
    params: {
      slug: params.slug,
    },
  });

  return (
    <main>
      <Head>
        <title>{data[0].title.rendered}</title>

        {/* Assuming data[0].description exists for description. Adjust as necessary. */}
        <meta property="og:title" content={data[0].title.rendered} />
        <meta
          property="og:description"
          content="Your page description or a specific field from your data"
        />
        <meta property="og:image" content={data[0].fimg_url} />
        <meta property="og:type" content="article" />
      </Head>
      <img src={data[0].fimg_url} alt="" />
      <h1>{data[0].title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: data[0].content.rendered }} />
    </main>
  );
}
