node {
  stage('SCM') {
    checkout scm
  }

  stage('Backend') {
    dir('backend') {
      sh 'npm install'
      sh 'npm run coverage'
    }
  }
  
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner -Dsonar.coverage.clover.xmlReportPaths=backend/coverage/clover.xml"
    }
  }
}