# City map planner
## Engineer diploma team project
App created by: Mateusz Budzisz, Wiktor Rostkowski, Sebastian Kreft, Damian Kreft.

## Requirements
1. `Rider`, `Webstorm` & `Datagrip` 
2. `.NET 8.2 SDK` [MacOS](https://learn.microsoft.com/pl-pl/dotnet/core/install/macos), [Linux](https://learn.microsoft.com/pl-pl/dotnet/core/install/linux), [Windows](https://learn.microsoft.com/pl-pl/dotnet/core/install/windows?tabs=net70).
3. `Node 20+` [MacOS and Linux](https://github.com/nvm-sh/nvm), [Windows](https://github.com/coreybutler/nvm-windows).
4. `Pnpm 9+` once you got node installed just run:
   - `corepack enable`

## Local setup
**Assuming you run latest Rider, Datagrip + Webstorm (though Visual Studio + VS code should work fine too)**

1. `git clone git@github.com:EngineerDiplomaTeam/city-map-planner.git` \
   [GitHub docs regarding ssh setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent), as GitHub does not support password authentication anymore.
2. `cd Frontend && pnpm i --frozen-lockfile`
3. Open Rider.
4. Click *Open* from the top right corner of main window (if you have another project open, you can find this option inside *file > open*).
5. Select `Backend.sln` from `/Backend`. E.g.: `/home/mate/city-map-planner/Backend/Backend.sln`
6. Click green triangle next to *WebApi: http* from the top right corner of IDE.
7. Open Webstorm.
8. Click *Open* from the top right corner of main window (if you have another project open, you can find this option inside *file > open*).
9. Select `/Frontend` directory from repository. E.g.: `/home/mate/city-map-planner/Frontend`
10. Click green triangle next to *Angular CLI Server* from the top right corner of IDE.
11. Open browser at https://localhost:4200/.
12. Accept untrusted SSL certificate.
13. Done. Every change you made in Frontend will be recompiled automatically, evey change you do to Backend needs manual restart (although both Rider and Visual Studio supports hot code swaps).

## Access database
1. Click *Open* from main DataGrip menu.
2. Select whole `/Database` directory. E.g.: `/home/mate/city-map-planner/Database`.
3. On the left side pannel, right click on `city_planner@city-planner.budziszm.pl`
4. Select *Properties*.
5. Fill User & Password fields (optionally save password forever).
6. Click *Ok*.
7. Wait for introspection to finish.
8. Go to *Properties* again.
9. Go to *Schemas* tab.
10. Expand *city_planner*
11. Select *data* and *user_data*
12. Click *Ok*.
13. Wait for introspection to finish.

On production use `city_planner_user` which allows only local connections and does not require password.

## Access SendGrid to send emails locally
1. Follow this tutorial: https://www.twilio.com/en-us/blog/send-emails-using-the-sendgrid-api-with-dotnetnet-6-and-csharp
2. Make `SendGrid` section of `appsettings.json` match your configuration
3. Paste access token to `SendGrid.ApiKey in `appsettings.Development.json`

## Contributing
The default branch is `main`, it is protected from direct pushes.
1. For your work please create new branch e.g.: `git checkout -b feature/my-awesome-feature`.
2. Commit your changes to feature branch.
3. PR will be validated:
   - All unit tests must pass, although code coverage is not enforced.
   - All build targets must compile.
   - Code style is enforced, for Frontend run `pnpm ng lint` locally to see if your changes are compliant.
4. Wait for approve.
5. Once merged, GitHub actions will deploy application to https://city-planner.budziszm.pl/ within few minutes.
   You may track deployment via logs [here](https://github.com/EngineerDiplomaTeam/city-map-planner/actions).

## EF always inside `Backend` directory
1. Initial setup user data: `dotnet ef migrations add InitialCreateUserData --project WebApi.Data/WebApi.Data.csproj --startup-project WebApi/WebApi.csproj --context UserDataDbContext`
2. Initial setup data: `dotnet ef migrations add InitialCreateData --project WebApi.Data/WebApi.Data.csproj --startup-project WebApi/WebApi.csproj --context DataDbContext`
3. Remove all migrations: `dotnet ef migrations remove --project WebApi.Data/WebApi.Data.csproj --startup-project WebApi/WebApi.csproj`
4. Update user data: `dotnet ef database update --project WebApi.Data/WebApi.Data.csproj --startup-project WebApi/WebApi.csproj --context UserDataDbContext`
5. Update data: `dotnet ef database update --project WebApi.Data/WebApi.Data.csproj --startup-project WebApi/WebApi.csproj --context DataDbContext`
6. Run permission script after each migration: `../Database/structure.sql` (Use DataGrip or psql)

## Sources used

1. https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app?tabs=netcore-cli
2. https://stackoverflow.com/a/71842300
3. https://www.learnentityframeworkcore.com/configuration/fluent-api/model-configuration#schema
4. https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0
5. TODO: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/social/other-logins?view=aspnetcore-8.0
6. TODO: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-enable-qrcodes?view=aspnetcore-8.0




