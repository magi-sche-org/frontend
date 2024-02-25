{
  containerDefinitions: [
    {
      cpu: 0,
      essential: true,
      image: '{{ must_env `IMAGE_NAME` }}',
      logConfiguration: {
        logDriver: 'awslogs',
        options: {
          'awslogs-group': '/ecs/magische-{{ must_env `ENV` }}-webfront-server',
          'awslogs-region': '{{ must_env `AWS_REGION` }}',
          'awslogs-stream-prefix': 'magische-{{ must_env `ENV` }}-webfront-server',
        },
      },
      name: 'magische-{{ must_env `ENV` }}-webfront',
      portMappings: [
        {
          appProtocol: '',
          containerPort: 3000,
          hostPort: 3000,
          protocol: 'tcp',
        },
      ],
      environment: [
        {
          name: 'NEXT_PUBLIC_GO_ENDPOINT',
          value: '{{ must_env `API_ENDPOINT` }}',
        },
      ],
    },
  ],
  cpu: '{{ must_env `CPU` }}',
  executionRoleArn: 'arn:aws:iam::905418376731:role/magische-{{ must_env `ENV` }}-webfront-server-task-exec',
  family: 'magische-{{ must_env `ENV` }}-webfront',
  ipcMode: '',
  memory: '{{ must_env `MEMORY` }}',
  networkMode: 'awsvpc',
  pidMode: '',
  requiresCompatibilities: [
    'FARGATE',
  ],
  runtimePlatform: {
    cpuArchitecture: '{{ must_env `CPU_ARCHITECTURE` }}',
    operatingSystemFamily: 'LINUX',
  },
  tags: [
    {
      key: 'Env',
      value: '{{ must_env `ENV` }}',
    },
    {
      key: 'Service',
      value: 'webfront',
    },
    {
      key: 'Name',
      value: 'magische-{{ must_env `ENV` }}-webfront-server',
    },
  ],
  taskRoleArn: 'arn:aws:iam::905418376731:role/magische-{{ must_env `ENV` }}-webfront-server-task',
}
