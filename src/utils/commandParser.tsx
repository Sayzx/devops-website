import React from 'react';
import { mockNamespaces, mockPods, mockServices, mockDeployments, mockLogs } from '../data/mockK8s';

export interface CommandResult {
  output: string | React.ReactNode;
  error?: boolean;
}

let mockFs: Record<string, 'dir' | 'file'> = {
  'Documents': 'dir',
  'Downloads': 'dir',
  'kubeconfig.yaml': 'file'
};

const padRight = (str: string, length: number) => {
  return str + ' '.repeat(Math.max(0, length - str.length));
};

export const parseCommand = (command: string, currentNamespace: string): CommandResult => {
  const parts = command.trim().split(/\s+/);
  
  if (parts.length === 0 || parts[0] === '') return { output: '' };

  const cmd = parts[0];

  if (cmd === 'ls') {
    if (Object.keys(mockFs).length === 0) return { output: '' };
    const elements = Object.entries(mockFs).map(([name, type], idx) => (
      <span key={idx} style={{ color: type === 'dir' ? '#33ccff' : 'inherit', marginRight: '15px' }}>
        {name}
      </span>
    ));
    return { output: <div style={{ display: 'flex', flexWrap: 'wrap' }}>{elements}</div> };
  }

  if (cmd === 'touch') {
    if (parts.length < 2) return { output: 'touch: missing file operand', error: true };
    parts.slice(1).forEach(f => {
      if (mockFs[f] === 'dir') return;
      mockFs[f] = 'file';
    });
    return { output: '' };
  }

  if (cmd === 'mkdir') {
    if (parts.length < 2) return { output: 'mkdir: missing operand', error: true };
    parts.slice(1).forEach(d => {
      if (!mockFs[d]) mockFs[d] = 'dir';
    });
    return { output: '' };
  }

  if (cmd === 'vi' || cmd === 'vim' || cmd === 'nano') {
    if (parts.length < 2) return { output: `${cmd}: missing file operand`, error: true };
    const file = parts[1];
    if (mockFs[file] === 'dir') return { output: `"${file}" is a directory`, error: true };
    mockFs[file] = 'file';
    return { 
      output: `[${cmd} mock] Opened "${file}".\n(This is a terminal simulator. File saved to mock filesystem.)` 
    };
  }

  if (cmd === 'clear') {
    return { output: 'CLEAR' };
  }

  if (cmd === 'help') {
    return { output: 'Available mock commands:\n- clear\n- ls, touch, mkdir, vi\n- kubectl get pods|services|deployments|namespaces [-n namespace]\n- kubectl describe pod <name> [-n namespace]\n- kubectl logs <name> [-n namespace]' };
  }

  if (cmd === 'kubectl') {
    return handleKubectl(parts.slice(1), currentNamespace);
  }

  return { output: `bash: ${cmd}: command not found`, error: true };
};

const extractNamespace = (args: string[], defaultNs: string): { namespace: string, remainingArgs: string[] } => {
  const nIndex = args.indexOf('-n');
  const namespaceIndex = args.indexOf('--namespace');
  
  let index = -1;
  if (nIndex !== -1) index = nIndex;
  else if (namespaceIndex !== -1) index = namespaceIndex;

  if (index !== -1 && index + 1 < args.length) {
    const ns = args[index + 1];
    const newArgs = args.filter((_, i) => i !== index && i !== index + 1);
    return { namespace: ns, remainingArgs: newArgs };
  }

  return { namespace: defaultNs, remainingArgs: args };
};

const handleKubectl = (args: string[], defaultNamespace: string): CommandResult => {
  if (args.length === 0) {
    return { output: 'kubectl controls the Kubernetes cluster manager.\n\nFind more information at: https://kubernetes.io/docs/reference/kubectl/' };
  }

  const { namespace, remainingArgs } = extractNamespace(args, defaultNamespace);
  const action = remainingArgs[0];
  const resource = remainingArgs[1];
  const resourceName = remainingArgs[2];

  if (action === 'get') {
    if (resource === 'namespaces' || resource === 'ns') {
      let out = 'NAME              STATUS   AGE\n';
      mockNamespaces.forEach(ns => {
        out += `${padRight(ns, 18)}Active   45d\n`;
      });
      return { output: out.trimEnd() };
    }
    
    if (resource === 'pods' || resource === 'po') {
      const pods = mockPods[namespace];
      if (!pods) return { output: `No resources found in ${namespace} namespace.`, error: true };
      
      let out = 'NAME                                      READY   STATUS    RESTARTS   AGE\n';
      pods.forEach(p => {
        out += `${padRight(p.name, 42)}${padRight(p.ready, 8)}${padRight(p.status, 10)}${padRight(p.restarts, 11)}${p.age}\n`;
      });
      return { output: out.trimEnd() };
    }

    if (resource === 'services' || resource === 'svc') {
      const svcs = mockServices[namespace];
      if (!svcs) return { output: `No resources found in ${namespace} namespace.`, error: true };

      let out = 'NAME              TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                  AGE\n';
      svcs.forEach(s => {
        out += `${padRight(s.name, 18)}${padRight(s.type, 15)}${padRight(s.clusterIp, 17)}${padRight(s.externalIp, 16)}${padRight(s.port, 25)}${s.age}\n`;
      });
      return { output: out.trimEnd() };
    }

    if (resource === 'deployments' || resource === 'deploy') {
      const deps = mockDeployments[namespace];
      if (!deps) return { output: `No resources found in ${namespace} namespace.`, error: true };

      let out = 'NAME                 READY   UP-TO-DATE   AVAILABLE   AGE\n';
      deps.forEach(d => {
        out += `${padRight(d.name, 21)}${padRight(d.ready, 8)}${padRight(d.upToDate, 13)}${padRight(d.available, 12)}${d.age}\n`;
      });
      return { output: out.trimEnd() };
    }

    return { output: `error: the server doesn't have a resource type "${resource}"`, error: true };
  }

  if (action === 'describe') {
    if ((resource === 'pod' || resource === 'pods') && resourceName) {
      const pods = mockPods[namespace];
      const pod = pods?.find(p => p.name === resourceName);
      if (!pod) return { output: `Error from server (NotFound): pods "${resourceName}" not found`, error: true };

      return { output: `Name:         ${pod.name}\nNamespace:    ${namespace}\nPriority:     0\nNode:         minikube/192.168.49.2\nStart Time:   Mon, 20 Apr 2026 10:00:00 +0000\nLabels:       app=${pod.name.split('-')[0]}\nStatus:       ${pod.status}\nIP:           10.244.0.5\nContainers:\n  main:\n    Container ID:   containerd://abc123def456\n    Image:          nginx:1.25.1\n    Image ID:       docker.io/library/nginx@sha256:1234567890\n    Port:           80/TCP\n    State:          Running\n    Ready:          True\n    Restart Count:  ${pod.restarts}\nEvents:\n  Type    Reason     Age   From               Message\n  ----    ------     ----  ----               -------\n  Normal  Scheduled  12m   default-scheduler  Successfully assigned ${namespace}/${pod.name} to minikube\n  Normal  Pulled     12m   kubelet            Successfully pulled image "nginx:1.25.1"\n  Normal  Created    12m   kubelet            Created container main\n  Normal  Started    12m   kubelet            Started container main` };
    }
    return { output: `error: required resource not specified or invalid`, error: true };
  }

  if (action === 'logs') {
    if (!resource) return { output: `error: expected 'logs (POD | TYPE/NAME)'`, error: true };
    const logs = mockLogs[resource];
    if (!logs) {
      const podExists = mockPods[namespace]?.some(p => p.name === resource);
      if (podExists) return { output: `(No logs found for ${resource})` };
      return { output: `Error from server (NotFound): pods "${resource}" not found`, error: true };
    }
    return { output: logs.join('\n') };
  }

  return { output: `kubectl: unknown command "${action}"`, error: true };
};
