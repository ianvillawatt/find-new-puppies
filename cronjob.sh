export EDITOR=nano
crontab -e
# enter this:
# 0 8-23 * * * /usr/bin/node /home/ian/repos/find-new-puppies/dist/index.js