# Ezer

Web app built to help church treasurer with bookkeeping and tracking church finances in a seemless and easy to use system.

## Todos:

-   [ ] Do not allow record with $0
-   [ ] If Deposit date is null, set next value on new record form to null
-   [ ] View Records within a Deposit
-   [ ] Set Records within a Deposit as "deposited" from "recorded"
-   [ ] Make it so cannot delete member if there is data or diezmos for them
-   [ ] Add change password link/view = /?view=update_password (/?view=forgotten_password)
-   [ ] Update forgot password email template
-   [ ] Add year dropdown to reports 2024, 2023, etc...
-   [ ] Add form to add or remove admins
-   [ ] Add form to change user's "status" admin, user, editor etc... Only admins can view
-   [ ] Add sum for open deposits on deposit list (view deposits would show deposit view. Add missing fields. Only for open deposits)
-   [ ] isLast modified being updated on edits?
-   [ ] Add greeting and name to header menu
-   [ ] Preference of language
-   [ ] Dark mode please
-   [ ] Add company/org table and comp_ref/org_id to all relevant tables
-   [ ] Vendors for expenses? Quickbooks style? To view all expenses for a particular vendor
-   [ ] "Positions" table? President of X dept., secretary of X society with foreign ID on member's table? If position is not null on member's table they can view reports for that dept/sociedad
-   [ ] Permissions
-   [ ] Error after login. Firefox error only seems like and in dev only
-   [ ] Custom Report and export data.
-   [ ] CSV import. Yes but ew
-   [ ] upgrade next to 14.1.1

## Done:

-   [x] remove Doubleclick on form
-   [x] Add loading to form until after submission completes. Possibly disable fields
-   [x] Add loading mantine notification on forms
-   [x] Add error mantine notification on forms
-   [x] Add mobile menu (drawer in Mantine)
-   [x] RLS in supabase? Roles? - in progress
-   [x] /new/record and /new/deposit instead of /record/new
-   [x] new dept form
-   [x] new member form
-   [x] Be able to delete deposits
-   [x] Resend to send auth emails
