export default function LogIn() {
  return (
    <section>
      <h1>Log in to your account</h1>
      <form action="/api/log-in" method="POST">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button>Log in</button>
      </form>
    </section>
  );
}
