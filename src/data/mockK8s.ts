export interface Pod {
  name: string;
  ready: string;
  status: string;
  restarts: string;
  age: string;
}

export interface Service {
  name: string;
  type: string;
  clusterIp: string;
  externalIp: string;
  port: string;
  age: string;
}

export interface Deployment {
  name: string;
  ready: string;
  upToDate: string;
  available: string;
  age: string;
}

export const mockNamespaces = ['default', 'kube-system', 'monitoring', 'ingress-nginx'];

export const mockPods: Record<string, Pod[]> = {
  default: [
    { name: 'nginx-deployment-5d8f6d7f6d-abc12', ready: '1/1', status: 'Running', restarts: '0', age: '12d' },
    { name: 'nginx-deployment-5d8f6d7f6d-xyz34', ready: '1/1', status: 'Running', restarts: '1', age: '12d' },
    { name: 'frontend-app-84cf8d8f99-mno56', ready: '1/1', status: 'Running', restarts: '0', age: '5h' },
    { name: 'backend-api-bd78b9cd-pqr78', ready: '1/1', status: 'Running', restarts: '3', age: '2d' },
    { name: 'redis-cache-0', ready: '1/1', status: 'Running', restarts: '0', age: '20d' },
  ],
  'kube-system': [
    { name: 'coredns-558bd4d5db-jf9dk', ready: '1/1', status: 'Running', restarts: '0', age: '45d' },
    { name: 'etcd-minikube', ready: '1/1', status: 'Running', restarts: '2', age: '45d' },
    { name: 'kube-apiserver-minikube', ready: '1/1', status: 'Running', restarts: '2', age: '45d' },
  ],
};

export const mockServices: Record<string, Service[]> = {
  default: [
    { name: 'kubernetes', type: 'ClusterIP', clusterIp: '10.96.0.1', externalIp: '<none>', port: '443/TCP', age: '45d' },
    { name: 'frontend-svc', type: 'LoadBalancer', clusterIp: '10.100.20.45', externalIp: '192.168.1.100', port: '80:31234/TCP', age: '5h' },
    { name: 'backend-api-svc', type: 'ClusterIP', clusterIp: '10.100.80.12', externalIp: '<none>', port: '8080/TCP', age: '2d' },
    { name: 'redis-svc', type: 'ClusterIP', clusterIp: '10.100.5.99', externalIp: '<none>', port: '6379/TCP', age: '20d' },
  ],
  'kube-system': [
    { name: 'kube-dns', type: 'ClusterIP', clusterIp: '10.96.0.10', externalIp: '<none>', port: '53/UDP,53/TCP,9153/TCP', age: '45d' },
  ]
};

export const mockDeployments: Record<string, Deployment[]> = {
  default: [
    { name: 'nginx-deployment', ready: '2/2', upToDate: '2', available: '2', age: '12d' },
    { name: 'frontend-app', ready: '1/1', upToDate: '1', available: '1', age: '5h' },
    { name: 'backend-api', ready: '1/1', upToDate: '1', available: '1', age: '2d' },
  ],
  'kube-system': [
    { name: 'coredns', ready: '1/1', upToDate: '1', available: '1', age: '45d' }
  ]
};

export const mockLogs: Record<string, string[]> = {
  'nginx-deployment-5d8f6d7f6d-abc12': [
    '2026-04-20T10:00:00.123Z [notice] 1#1: using the "epoll" event method',
    '2026-04-20T10:00:00.125Z [notice] 1#1: nginx/1.25.1',
    '2026-04-20T10:00:00.126Z [notice] 1#1: built by gcc 12.2.1 20220924 (Alpine 12.2.1_git20220924-r4)',
    '2026-04-20T10:00:00.126Z [notice] 1#1: OS: Linux 5.15.49-linuxkit',
    '2026-04-20T10:00:00.127Z [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576',
    '2026-04-20T10:00:00.127Z [notice] 1#1: start worker processes',
    '2026-04-20T10:00:00.128Z [notice] 1#1: start worker process 29',
    '192.168.1.1 - - [20/Apr/2026:10:15:22 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.88.1" "-"',
  ]
};
