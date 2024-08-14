require 'fileutils'
require 'json'

def handler(event:, context:)
  efs_path = ENV['EFS_PATH']
  counter_file = File.join(efs_path, 'counter.txt')
  lock_file = File.join(efs_path, 'counter.lock')

  FileUtils.mkdir_p(efs_path) unless Dir.exist?(efs_path)

  count = 0
  File.open(lock_file, File::RDWR|File::CREAT, 0644) do |lock|
    lock.flock(File::LOCK_EX)
    
    if File.exist?(counter_file)
      count = File.read(counter_file).to_i
    end
    
    count += 1
    
    File.write(counter_file, count.to_s)
  end

  { statusCode: 200, body: JSON.generate(count: count) }
end