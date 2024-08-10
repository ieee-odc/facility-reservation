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
      sh "${scannerHome}/bin/sonar-scanner -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info -Dsonar.clover.reportPath=coverage/clover.xml-Dsonar.coverage.clover.xmlReportPaths=backend/coverage/clover.xml"
    }
  }
}