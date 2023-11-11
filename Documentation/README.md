# Documentation CI/CD
# Automatic build
You can find artifacts (compiled PDF file) for each build here: https://github.com/EngineerDiplomaTeam/city-map-planner/actions/workflows/documentation.yml

# Once merged
Once merged, documentation is available at https://city-planner.budziszm.pl/thesis

# Local compilation
1. `pdflatex thesis.tex`
2. `makeglossaries thesis`
3. `pdflatex thesis.tex`
4. `pdflatex thesis.tex`

Open `thesis.pdf`
