import { useEffect, useState } from "react";
import { db } from "../lib/fsdb";
import Error from "next/error";
import { GetServerSidePropsContext } from "next";

interface KeyPageProps {
  pageKey: string;
  initialContent: string;
  editable: boolean;
  noteTokens: string[];
  error?: number;
}

const KeyPage = (props: KeyPageProps) => {
  console.log({ props });
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [value, setValue] = useState(props.initialContent);

  useEffect(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }

    let first = true;
    const newSocket = new WebSocket("ws://localhost:4000");

    newSocket.addEventListener("message", (event) => {
      if (first) {
        first = false;
        setSocket(newSocket);
        console.info(event.data);
      } else {
        setValue(event.data);
      }
    });
    newSocket.addEventListener("open", () =>
      newSocket.send(
        JSON.stringify({
          key: props.pageKey,
          tokens: props.noteTokens,
        })
      )
    );
    newSocket.addEventListener("close", () => setSocket(null));
    newSocket.addEventListener("error", (error) => {
      console.error(error);
      setSocket(null);
    });
  }, [props.pageKey]);

  if (props.error) return <Error statusCode={props.error} />;

  if (props.editable) {
    return (
      <textarea
        autoFocus
        placeholder={"Copy the URL to share. Only you can edit."}
        readOnly={!socket}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (socket) socket.send(event.target.value);
        }}
      />
    );
  } else {
    return (
      <div
        className={`text-container ${value ? "" : "is-empty"}`}
        children={value || "This page is currently empty."}
      />
    );
  }
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const noteTokens = ctx.req.cookies?.noteTokens
    ? ctx.req.cookies.noteTokens.split(",")
    : [];

  const page = await db.get((ctx.params as { key: string }).key);
  if (!page) return { props: { error: 404 } };

  return {
    props: {
      pageKey: (ctx.params as { key: string }).key,
      initialContent: page.content,
      editable: noteTokens.includes(page.token),
      noteTokens,
    },
  };
};

export default KeyPage;
