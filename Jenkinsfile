pipeline {
  
  agent none
  stages {
    stage('Back-end') {
      agent {
        docker { 
          image 'node:20-alpine'
          args '-v /var/run/docker.sock:/var/run/docker.sock' 
        }
      }
      steps {
        sh 'node --version'
      }
    }
  }
}
