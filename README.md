# Next.js cookie auth example

For some reason it's hard to find a decent example of using standard HTTP cookies for authentication in Next.js.

## Run locally

1. Clone this repo
1. `npm install` in the directory
1. `npm run dev` to start the dev server

The server persists user/session info in the `db.sqlite` file.

## Architecture

There are three "page routes":

1. ### `pages/index.jsx`
   Checks the request cookies to find a session ID. If there is one that means the user is logged in. It uses the session ID to get the session from the DB, then gets the user ID from the session. It uses the user ID to get the user from the DB, then passes the user as a prop to the page component. The page either renders a welcome message, or links to sign up/log in (if there is no session).
1. ### `pages/log-in.jsx`
   Renders a form that submits a POST request with the user's email/pw to `/api/log-in`
1. ### `pages/sign-up.jsx`
   Renders a form that submits a POST request with the user's email/pw to `/api/sign-up`

There are three "API routes":

1. ### `api/log-in.js`
   Receives a POST form submission, verifies that the submitted email/pw matches an existing user, then creates a new session containing the user's ID and stores the session ID in a cookie. Finally redirects back to home.
1. ### `api/sign-up.js`
   Receives a POST form submission, creates a new user with the submitted email/pw, then creates a new session containing the user's ID and stores the session ID in a cookie. Finally redirects back to home.
1. ### `api/log-out.js`
   Receives a POST form submission, deletes the current session, then removes the session cookie. Finally redirects back to home.

## Missing features

There a few important things that you would want in a "real" app:

1. ### Password hashing
   Storing passwords in clear text is terrible and super unsafe. You should be using a strong hashing algorithm like BCrypt to hash the passwords before storing them in the DB.
1. ### Signing cookies
   The session cookies are not signed right now. This means we cannot trust that they haven't been manipulated. Since the session IDs are cryptographically strong 24-character strings there are about 2e+43 possibilities (two followed by 43 zeroes). It's incredibly unlikely anyone could guess one, so there isn't too much risk in letting users mess with their cookie.

## Page reloads

Currently the sign up/log in/log out forms all cause a full page reload. This is because Next.js doesn't have any built-in support for "mutations" of data. We're effectively bypassing Next's system and just starting from scratch with a new request.

This is _fine_: user's don't care that much about reloads. However if you _need_ to avoid this (maybe you have some persistent client-side state that you don't want to get reset when the user logs in/out), you can try the following code.

[Sidenote: this pattern is inspired by [Remix.run](https://remix.run). If you really want progressively enhanced forms in React it's probably a better choice than Next.]

<details>
<summary>Totally optional attempt to avoid page reloads</summary>

To avoid reloads you'd have to build your own form abstraction that prevented the default submission, used `fetch` to send the POST, then re-rendered the page/followed the redirect client-side. Here's a rough example implementation:

```jsx
/*
  Create a <Form> component you can use as a drop-in replacement for the native HTML <form>
*/
function Form({ action, method, ...rest }) {
  // access Next's client-side router
  const router = useRouter();
  function submit(event) {
    // stop normal form submission
    event.preventDefault();

    // gather all named inputs
    const data = new FormData(event.target);

    // create a url-encoded body (like a native form, `name=oli&other=thing` etc)
    const body = new URLSearchParams(data).toString();

    // send the HTTP request ourself using fetch
    fetch(action, {
      method,
      body,
      headers: {
        // make sure the server knows the body is urlencoded
        "content-type": "application/x-www-form-urlencoded",
        // tell the server this wasn't a normal form
        "x-requested-with": "fetch",
      },
    }).then((res) => {
      // annoyingly `fetch` cannot follow normal redirects
      // so we have to hack it with a custom header to tell us where to go
      const redirect = res.headers.get("x-redirect");
      if (router.pathname === redirect) {
        // if we're on the same page just reload all the data
        router.replace(router.asPath);
      } else {
        // otherwise navigate client-side to the new page
        router.push(redirect);
      }
    });
  }
  return <form action={action} method={method} onSubmit={submit} {...rest} />;
}
```

Then your server needs to handle the redirect differently depending on whether it got a normal form POST, or one from your custom Form:

```js
function redirect(to, req, res) {
  if (req.headers["x-requested-with"] === "fetch") {
    // this was sent by our custom Form component
    // don't do a normal redirect, instead set the custom header
    // the client-side JS will navigate to the new page
    res.setHeader("x-redirect", to);
    res.status(204).send("");
  } else {
    // this was sent by a normal HTML form
    // we can send back a normal redirect and let the browser follow it automatically
    res.redirect("/");
  }
}
```

</details>
