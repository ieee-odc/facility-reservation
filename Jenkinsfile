pipeline {
    agent none
    stages {
        stage('Back-end') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root' // Run as root user
                }
            }
            steps {
                sh 'node --version'
                sh 'docker --version'
            }
        }
    }
}
