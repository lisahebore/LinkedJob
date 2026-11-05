-- Demo data for marking. Run AFTER the schema and AFTER you have signed up the demo accounts
-- through the app (see README "Demo accounts"). Passwords are chosen by you at sign-up and
-- are never stored in this repository.
--
-- Demo accounts (create them in the app first):
--   candidate: demo.candidate@example.com   (register as a job seeker)
--   company:   demo.company@example.com     (register as a company, IPA number IPA-DEMO-001)
--
-- Then upload one PDF in the candidate's Documents tab so there is a file to request.

update public.profiles
set full_name = 'Mary Kila',
    headline = 'Accountant - 4 years experience',
    location = 'Port Moresby, National Capital District',
    latitude = -9.4438,
    longitude = 147.1803,
    bio = 'Finance graduate with experience in payroll, reconciliation and reporting for SMEs.',
    skills = array['Accounting', 'MYOB', 'Excel', 'Payroll']
where id = (select id from auth.users where email = 'demo.candidate@example.com');

-- Verification is an administrator action: this is the equivalent of checking the IPA register.
update public.companies
set verification = 'verified',
    industry = 'Retail',
    location = 'Lae, Morobe',
    latitude = -6.7249,
    longitude = 146.9996,
    about = 'Family-owned retail group hiring finance and operations staff.',
    website = 'https://example.com'
where id = (select id from auth.users where email = 'demo.company@example.com');

-- A pending request so the candidate has something to accept or decline.
insert into public.access_requests (company_id, individual_id, message)
select c.id, p.id, 'We would like to review your CV for an Accounts Officer role.'
from auth.users c, auth.users p
where c.email = 'demo.company@example.com'
  and p.email = 'demo.candidate@example.com'
on conflict do nothing;
