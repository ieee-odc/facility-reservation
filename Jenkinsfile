node {
  stage('SCM') {
    checkout scm
  }
  
  stage('Backend') {
    dir('backend') {
      sh 'npm install'
      sh 'npm test'
    }
  }
  
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}