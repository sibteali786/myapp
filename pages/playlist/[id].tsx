import { validateToken } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { InferGetServerSidePropsType } from "next";
import GradientLayout from "../../components/gradientLayout";

export const getServerSideProps = async ({ query, req }) => {
  const { id } = validateToken(req.cookies.TRAX_ACCESS_TOKEN);
  const [playlist] = await prisma.playlist.findMany({
    where: {
      id: +query.id, // the names comes from filename [id].tsx insdie sqaure brackets
      userId: id, // should have userId same as what returned by playlist.
    },
    include: {
      songs: {
        include: {
          artist: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  return {
    props: { playlist },
  };
};

const getBGColor = (id) => {
  const colors = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "gray",
    "teal",
    "yellow",
  ];

  return colors[id - 1] || colors[Math.floor(Math.random() * colors.length)];
};

const Playlist = ({
  playlist,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const color = getBGColor(playlist.id);

  return (
    <GradientLayout
      color={color}
      roundImage={false}
      title={playlist.name}
      subtitle="playlist"
      description={`${playlist.songs.length} songs`}
      image={`https://picsum.photos/400?random=${playlist.id}`}
    >
      <div>dfd</div>
    </GradientLayout>
  );
};

export default Playlist;
