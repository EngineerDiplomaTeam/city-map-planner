# City map planner
## Engineer diploma team project
App created by: Mateusz Budzisz, Wiktor Rostkowski, Sebastian Kreft, Damian Kreft.

## Requirements
1. `.NET 7 SDK` [MacOS](https://learn.microsoft.com/pl-pl/dotnet/core/install/macos), [Linux](https://learn.microsoft.com/pl-pl/dotnet/core/install/linux), [Windows](https://learn.microsoft.com/pl-pl/dotnet/core/install/windows?tabs=net70).
2. `Node 18.10+` [MacOS and Linux](https://github.com/nvm-sh/nvm), [Windows](https://github.com/coreybutler/nvm-windows).
3. `Pnpm 8+` once you got node installed just run:
   - `corepack enable`
   - `corepack prepare pnpm@latest-8 --activate`

## Local setup
**Assuming you run latest Rider + Webstorm (though Visual Studio + VS code should work fine too)**

1. `git clone git@github.com:EngineerDiplomaTeam/city-map-planner.git` \
   [GitHub docs regarding ssh setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent), as GitHub does not support password authentication anymore.
2. `cd Frontend && pnpm i --frozen-lockfile`
3. Open Rider.
3. Click *Open* from the top right corner of main window (if you have another project open, you can find this option inside *file > open*).
4. Select `Backend.sln` from `/Backend`. E.g.: `/home/mate/city-map-planner/Backend/Backend.sln`
5. Click green triangle next to *WebApi: http* from the top right corner of IDE.
6. Open Webstorm.
7. Click *Open* from the top right corner of main window (if you have another project open, you can find this option inside *file > open*).
8. Select `/Frontend` directory from repository. E.g.: `/home/mate/city-map-planner/Frontend`
9. Click green triangle next to *Angular CLI Server* from the top right corner of IDE.
10. Open browser at https://localhost:4200/.
11. Accept untrusted SSL certificate.
12. Done. Every change you made in Frontend will be recompiled automatically, evey change you do to Backend needs manual restart (although both Rider and Visual Studio supports hot code swaps).

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