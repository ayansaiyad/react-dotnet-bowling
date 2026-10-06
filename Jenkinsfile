node('Interns_2026_Win_agent') {
    
    stage('Checkout') {
        cleanWs()
        // Automatic Jenkins SCM checkout or manual clone:
        // checkout scm
        bat 'git clone -b main https://github.com/ayansaiyad/react-dotnet-bowling.git'
    }
    
    dir('react-dotnet-bowling') {
        
        stage('Frontend - Install, Test & Build') {
            dir('frontend') {
                bat 'npm ci'
                bat 'npm run test:coverage'
                bat 'npm run build'
            }
        }

        stage('Backend - Restore') {
            bat 'dotnet restore backend/Backend.sln'
        }

        stage('SonarQube Analysis & Backend Test') {
            withSonarQubeEnv('Sonar-qube') {
                bat '''
                    dotnet sonarscanner begin /k:"react-dotnet-bowling" /n:"React DotNet Bowling" /v:"1.0" ^
                    /d:sonar.cs.cobertura.reportsPaths="**/coverage.cobertura.xml" ^
                    /d:sonar.javascript.lcov.reportPaths="frontend/coverage/lcov.info" ^
                    /d:sonar.exclusions="**/node_modules/**,**/bin/**,**/obj/**,**/dist/**,**/build/**,**/coverage/**,**/*.sqlite,**/TestResults/**,**/*.html,**/*.css,backend/Data/BowlingLeagueContext.cs" ^
                    /d:sonar.coverage.exclusions="backend/Program.cs,backend/Data/BowlingLeagueContext.cs,backend/Data/*.cs,Backend.Tests/**,**/*.test.tsx,**/*.test.ts"
                '''
                bat 'dotnet build backend/Backend.sln --no-incremental -c Release'
                bat 'dotnet test backend/Backend.sln -c Release --collect:"XPlat Code Coverage"'
                bat 'dotnet sonarscanner end'
            }
        }

        stage('Backend - Publish') {
            bat 'dotnet publish -c Release -o backend/Output backend/Backend.sln'
        }

        stage('Zip Artifacts') {
            zip dir: 'frontend/dist/', overwrite: true, zipFile: 'Frontend_Artifact.zip'
            zip dir: 'backend/Output/', overwrite: true, zipFile: 'Backend_Artifact.zip'
        }
    }
}
