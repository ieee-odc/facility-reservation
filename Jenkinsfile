node {
  stage('SCM') {
    checkout scm
  }

  stage('Backend') {
    dir('backend') {
      sh 'npm install'
      sh 'npm run test:coverage'
    }
  }
  
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info -Dsonar.clover.reportPath=backend/coverage/clover.xml -Dsonar.coverage.clover.xmlReportPaths=backend/coverage/clover.xml"
    }
  }
}