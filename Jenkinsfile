pipeline {
    agent {
        docker {
            image 'node:20'
        }
    }
    options {
        skipDefaultCheckout()
    }
    environment {
        CI_PROJECT_DIR = "${WORKSPACE}"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'backend/**', allowEmptyArchive: true
                }
            }
        }
        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        
        /*
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'frontend/build/**', allowEmptyArchive: true
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        stage('Deploy Frontend') {
            when {
                branch 'feature/login-P3-6'
            }
            steps {
                dir('frontend') {
                    sh 'npm run deploy'
                }
            }
        }
        stage('Deploy Backend') {
            when {
                branch 'feature/login-P3-6'
            }
            steps {
                dir('backend') {
                    sh 'npm run deploy'
                }
            }
        }
        */
    }
    post {
        always {
            cleanWs()
        }
    }
}
