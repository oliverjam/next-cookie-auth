import Link from "next/link";
import { getSession, getUser } from "../lib/database/model.js";

export async function getServerSideProps(context) {
  const props = {};
  const sid = context.req.cookies.sid;
  if (sid) {
    // swallow errors as we don't care if session is not found
    const session = await getSession(sid).catch(() => {});
    if (session) {
      props.user = await getUser(session.user_id);
    }
  }
  return { props };
}

export default function Home({ user }) {
  if (user) {
    return (
      <>
        <h1>Welcome back {user.email}</h1>
        <form action="/api/log-out" method="POST">
          <button>Log out</button>
        </form>
      </>
    );
  }
  return (
    <>
      <h1>Welcome to The App</h1>
      <Link href="/log-in">Log in</Link> or <Link href="/sign-up">Sign up</Link>
    </>
  );
}
