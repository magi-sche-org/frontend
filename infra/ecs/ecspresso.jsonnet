{
  region: 'ap-northeast-1',
  cluster: 'magische-{{ must_env `ENV` }}',
  service: 'magische-{{ must_env `ENV` }}-webfront',
  service_definition: '',
  task_definition: 'ecs-task-def.jsonnet',
  timeout: '10m0s',
}
