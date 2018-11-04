pipeline {
	agent any

	stages {
		stage ('boolean-lists - Checkout') {
			steps {
				checkout([$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github', url: 'https://github.com/pfehrmann/boolean-lists']]])
			}
		}

		stage("SonarQube") {
			parallel {

				stage('Frontend') {
					steps {
						script {
							def scannerHome = tool 'SonarScanner Default';
							withSonarQubeEnv('sonarqube.dillipp.de') {
								dir('frontend') {
									sh "npm install"
									sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=boolean-lists:frontend -Dsonar.sources='src,public' -Dsonar.projectName='Boolean Lists (Frontend)'"
								}
							}
						}
					}
				}

				stage('Backend') {
					steps {
						script {
							def scannerHome = tool 'SonarScanner Default';
							withSonarQubeEnv('sonarqube.dillipp.de') {
								dir('backend') {
									sh "npm install"
									sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=boolean-lists:backend -Dsonar.sources='src' -Dsonar.projectName='Boolean Lists (Backend)'"
								}
							}
						}
					}
				}
			}
		}


		stage ('boolean-lists - Deploy') {
			steps {
				script {
					def remote = [:]
					remote.name = "server"
					remote.host = "server.dillipp.de"
					remote.allowAnyHosts = true
					withCredentials([usernamePassword(credentialsId: 'boolean-lists-user', passwordVariable: 'password', usernameVariable: 'username')]) {
						remote.user = username
						remote.password = password
						sshCommand remote: remote, command: 'git stash; git pull; git stash pop; docker-compose stop api frontend; docker-compose up --build -d api frontend'
					}
				}
			}
		}
	}
}
