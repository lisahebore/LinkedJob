# LinkedJob

LinkedJob is a mobile app that connects job seekers with verified companies in Papua New Guinea.
Job seekers create a profile and upload their CV. Companies register with their IPA number and,
once an administrator has verified it, can browse candidates and ask to see a candidate's
documents. **Only the job seeker decides**: a company can view and download a CV only after the
job seeker accepts its request, and that rule is enforced by the database, not by the app.

- **Student:** `<YOUR NAME>` &nbsp;|&nbsp; **Student number:** `<YOUR STUDENT NUMBER>`
- **Unit:** IS323 Mobile App Development, PNG University of Technology
- **Stack:** React Native, Expo SDK 57 (managed workflow), Expo Router, TypeScript, Supabase

## What the app does

| Job seeker                                           | Company                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| Register, sign in, sign out, reset password          | Register with an IPA number, sign in, sign out               |
| Edit profile (headline, bio, skills, location)       | Edit company profile and location                            |
| Upload, view, rename and delete CVs (PDF or Word)    | Search candidates, sorted by distance from the company       |
| Accept or decline each company's request             | Send a request, edit its message, or cancel it while pending |
| Weather forecast for their saved or current location | Download a candidate's documents **after** they accept       |

## Setup and run (from a clean clone)

Requirements: **Node.js 22 or newer** (the Supabase client requires it), Git, an Expo account, and
**Expo Go for SDK 57 on a physical Android phone**. This project is pinned to **Expo SDK 57**
(React 19.2.3, React Native 0.86.3, TypeScript 6). If the store version of Expo Go is older, install the
SDK 57 build from <https://expo.dev/go>.

```bash
git clone <your-repo-url> linkedjob
cd linkedjob
cp .env.example .env          # then fill in the two Supabase values (see below)
npm run setup                 # npm install, then npx expo install --check (verifies SDK 57 versions)
npx expo start                # scan the QR code with Expo Go
```

If the QR code will not connect, use `npx expo start --tunnel`. If `expo install --check` offers to
fix versions, accept; it only moves packages to the versions SDK 57 expects.

Commit `package.json` and `package-lock.json` after your first successful run so the SDK stays pinned.
Do not upgrade it mid-semester.

Other scripts: `npm run typecheck`, `npm run lint`, `npm run format`.

### 1. Create the Supabase project (one time)

1. Create a free project at <https://supabase.com>.
2. **SQL Editor > New query**, paste all of `supabase/schema.sql`, run it. This creates the tables,
   the Row Level Security policies, the private `documents` storage bucket and its policies.
3. **Authentication > Email Templates > Reset Password**: replace the body so it shows the code,
   for example `Your LinkedJob reset code is {{ .Token }}`. The app asks for this code, so the
   default "click this link" template will not work.
4. Optional for demos: **Authentication > Providers > Email > Confirm email** off, so new accounts
   sign in immediately. Leave it on if you want to demonstrate email verification.
5. **Project Settings > API**: copy the project URL and the `anon` public key into `.env`.

### 2. Environment variables

| Variable                        | Meaning                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Your project URL, `https://<ref>.supabase.co`                   |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | The **anon / publishable** key. Never use the service_role key. |

`.env` is git-ignored; `.env.example` lists the names with dummy values. The anon key is safe to
ship in an app because every access rule is a database policy, not client code.

### 3. Demo accounts and sample data

An empty app cannot be marked, so seed it:

1. In the app, register a **job seeker** with `demo.candidate@example.com` and a **company** with
   `demo.company@example.com` and IPA number `IPA-DEMO-001`. Choose your own passwords and give
   them to your marker separately. They are never stored in this repository.
2. Sign in as the job seeker and upload a PDF under **Documents**.
3. Run `supabase/seed.sql` in the SQL Editor. It fills in the profiles, **verifies the demo company**
   (the administrator step) and creates one pending request.

### How a company gets verified

Companies cannot verify themselves: the database blocks changes to `ipa_number` and
`verification` from the app. An administrator checks the IPA register, then runs in the SQL Editor:

```sql
update public.companies set verification = 'verified' where ipa_number = 'IPA-DEMO-001';
```

## External APIs and services

| Service                  | Used for                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| Supabase Auth            | Registration, sign-in, session persistence, password reset by emailed code                |
| Supabase Postgres + RLS  | Profiles, companies, documents, access requests; ownership enforced per row               |
| Supabase Storage         | CV files in a private bucket; companies get 2-minute signed links, only after acceptance  |
| Open-Meteo Forecast API  | Current weather and 5-day forecast for the saved or current location (no key needed)      |
| Open-Meteo Geocoding API | Turns a typed town name into coordinates, which feed the weather and the distance sorting |
| `expo-location`          | Device position (with graceful permission denial) and reverse geocoding to a place name   |

Each integration handles loading, success, empty and error states. The two Open-Meteo calls also
handle 429 rate-limit responses. Network calls time out (15 seconds for the REST APIs, 60 for file
uploads) and every failure offers a retry.

## Project structure

```
app/              Expo Router screens only: (auth), (individual), (company)
src/components/   Reusable presentational components
src/hooks/        Data hooks (React Query) and device hooks; screens use these
src/services/     All Supabase and REST calls; no UI
src/context/      AuthContext
src/lib/          Supabase client, query client and offline cache, HTTP timeout helper
src/types/        Shared TypeScript types
src/utils/        Validation schemas, formatters, error messages
src/theme/        The single theme file: colours, spacing, type scale
supabase/         schema.sql (tables, RLS, storage rules) and seed.sql
docs/             Draft material for the technical report
```

`app/` uses `(individual)` and `(company)` groups instead of a single `(tabs)` group because the two
account types have different tabs and different route guards (`RequireRole`).

## Building the APK and AAB

Profiles are in `eas.json`: `preview` builds the installable **APK**, `production` builds the
Play Store **AAB**, `development` is optional.

```bash
npm install -g eas-cli
eas login
eas init                       # adds extra.eas.projectId to app.json
```

Cloud builds do not read your local `.env`. Create the two variables for each environment you
build (Expo dashboard > Project settings > Environment variables > Add Variables, or the CLI;
see <https://docs.expo.dev/eas/environment-variables/manage/> for the current command):

```bash
eas env:set --name EXPO_PUBLIC_SUPABASE_URL --value <url> --environment preview --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <anon-key> --environment preview --visibility plaintext
# repeat with --environment production
```

Then, with all work committed:

```bash
eas build --platform android --profile preview       # APK: submit this
eas build --platform android --profile production    # AAB: submit this
```

App identity lives in `app.json`: package `com.linkedjob.app`, `version` 1.0.0, `android.versionCode` 1
(EAS auto-increments it for production), a 1024x1024 icon, an adaptive icon, and only the two location
permissions the app uses. The splash image and background colour are set through the
`expo-splash-screen` plugin, which is how SDK 57 configures them.

Install the APK on a real phone and repeat the demo flow. Back up the keystore with
`eas credentials`; never commit it.

## Screenshots

_Add screenshots of the installed APK here: welcome, register, job seeker home with weather,
documents list and detail, upload, request detail (accept/decline), candidates list, candidate
detail, company request with downloadable documents, offline banner, error with retry._

## Known limitations

- Company verification is a manual administrator step; there is no admin screen in the app.
- A company's request covers all of a candidate's documents, not individual files.
- Downloads open a short-lived signed link in the phone's browser; there is no in-app PDF viewer.
- There are no push notifications: remote push does not work in Expo Go (SDK 53+), so job seekers see
  new requests when they open the app (their Requests tab shows a badge for pending ones).
- Offline mode is read-only: the last-fetched lists are cached on the device, but changes need a
  connection.
- Weather and place search use Open-Meteo's free tier and show a retry message when it is busy.
- `<ADD ANY LIMITATION YOU FIND WHILE TESTING ON YOUR PHONE>`

## Features cut (scope)

In-app notification inbox, per-document access grants, avatar photos, and a map screen were left out
so that authentication, CRUD, security rules and the two integrations could be done properly.

## AI assistance

> **Edit this section so it is true for you.** The handout requires you to declare which tools you
> used and for what, and you must be able to explain every line you submit.

- Tool: Claude (Anthropic). Used to draft the initial project structure, the Supabase schema and
  Row Level Security policies, the React Query data hooks and the screens.
- I reviewed the generated code, ran it on my own device, and `<describe what you changed or fixed>`.
- Build and EAS instructions above were checked against the current Expo documentation at
  <https://docs.expo.dev/eas/environment-variables/manage/>, not taken from the assistant.

## Credits

Expo, React Native, Supabase, TanStack Query, React Hook Form, Zod, date-fns, Open-Meteo
(CC BY 4.0, <https://open-meteo.com>).
