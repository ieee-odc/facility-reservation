pipeline {
  agent none
  stages {
    stage('Back-end') {
         agent {
        docker { image 'node:20-alpine' }
      }
      steps {
        bash 'node --version'
      }
    }
  }
}