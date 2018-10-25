pipeline {
  agent any
  stages {
    stage('Update config') {
      steps {
        sh 'git apply server-config.patch'
      }
    }
    stage('Build docker container') {
      steps {
        sh 'docker-compose build'
      }
    }
    stage('Restart docker') {
      steps {
        sh 'docker-compose restart'
      }
    }
  }
}