node {
  stage('SCM') {
    checkout scm
  }
  stage('Backend') {
    dir('backend') {
      stage('Install Backend Dependencies') {
        sh 'npm install'
      }

      /*stage('Build Backend') {
      }*/

      stage('Test Backend') {
        sh 'npm test --coverage'
      }
    }
  }
  
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}