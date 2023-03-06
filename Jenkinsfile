pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        nodejs(cacheLocationStrategy: workspace(), nodeJSInstallationName: 'Nodejs16') {
        sh '''ls
pwd
rm -rf build/
rm -rf pokerbuild.tar.gz
npm install --force
npm run build:prod
tar cvf pokerbuild.tar.gz build
ls'''
      }
    }
  }
    stage('Upload Build') {
          steps {
            sshPublisher(publishers: [sshPublisherDesc(configName: 'scrooge-casino', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''rm -rf /home/ubuntu/poker-client/build
tar -xf /home/ubuntu/pokerbuild.tar.gz -C /home/ubuntu/poker-client
rm -rf /home/ubuntu/pokerbuild.tar.gz''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'pokerbuild.tar.gz')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
         }
        }

  }
}
