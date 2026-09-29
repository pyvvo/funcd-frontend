import { IPyNode } from '@/hm-flow/node/types';
import { v4 as uuid } from 'uuid';
export interface IWorkflowStep {
  name: string;
  type: 'component';
  properties: {
    image: string;
    metadata: {
      position: {
        x: number;
        y: number;
      };
    };
    parameters?: {} | null;
  };
}

export interface IWorkflowDefinition {
  api_version: string;
  kind: 'WorkflowDefinition';
  metadata: {
    name: string;
    annotations?: {
      description?: string;
      version?: string;
    };
  };
  spec: {
    steps: IWorkflowStep[];
  };
}

export interface IWorkflowModel {
  id: string;
  workflow_def: IWorkflowDefinition;
}

export interface INodeModel {
  id: string;
  image: string;
  node_def: INodeDefinition;
}

export interface INodeDefinition {
  api_version: string;
  kind: string;
  metadata: {
    name: string;
    annotations: {
      description: string;
      label: string;
      icon: string;
      color: string;
      ui: string;
      version: string;
    };
  };
  spec: {
    properties: {
      parameters: {
        validation_schema: {
          type: string;
          properties: Record<
            string,
            {
              default: string | number;
              description: string;
              type: string;
            }
          >;
          required: string[];
        };
      };
    };
  };
}

export const nodeModels: INodeModel[] = [
  {
    id: uuid(),
    image: 'pyvvo/gmail:latest',
    node_def: {
      api_version: 'core.oam.dev/v1beta1',
      kind: 'ComponentDefinition',
      metadata: {
        name: 'gmail',
        annotations: {
          description: 'My gmail description',
          label: 'Gmail',
          icon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png',
          color: '#FF0000',
          ui: 'pyNode',
          version: '1.0.0'
        }
      },
      spec: {
        properties: {
          parameters: {
            validation_schema: {
              type: 'object',
              properties: {
                from: {
                  default: '',
                  description: 'From to send a message',
                  type: 'string'
                },
                to: {
                  default: '',
                  description: 'Who will receive a mail',
                  type: 'string'
                },
                object: {
                  default: '',
                  description: 'Object mail',
                  type: 'string'
                },
                message: {
                  default: '',
                  description: 'Message mail',
                  type: 'string'
                }
              },
              required: ['from', 'to', 'message']
            }
          }
        }
      }
    }
  },
  {
    id: uuid(),
    image: 'pyvvo/gitlab:latest',
    node_def: {
      api_version: 'core.oam.dev/v1beta1',
      kind: 'ComponentDefinition',
      metadata: {
        name: 'gitlab',
        annotations: {
          description: 'Intégration avec GitLab',
          label: 'GitLab',
          icon: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/144_Gitlab_logo_logos-512.png',
          color: '#FC6D26',
          ui: 'pyNode',
          version: '1.0.0'
        }
      },
      spec: {
        properties: {
          parameters: {
            validation_schema: {
              type: 'object',
              properties: {
                repo: {
                  default: '',
                  description: 'Nom du dépôt GitLab',
                  type: 'string'
                },
                branch: {
                  default: 'main',
                  description: 'Nom de la branche',
                  type: 'string'
                },
                action: {
                  default: 'commit',
                  description: 'Action à effectuer (commit, merge, pipeline)',
                  type: 'string'
                }
              },
              required: ['repo', 'action']
            }
          }
        }
      }
    }
  },
  {
    id: uuid(),
    image: 'pyvvo/facebook:latest',
    node_def: {
      api_version: 'core.oam.dev/v1beta1',
      kind: 'ComponentDefinition',
      metadata: {
        name: 'facebook',
        annotations: {
          description: 'Interaction avec Facebook',
          label: 'Facebook',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png',
          color: '#1877F2',
          ui: 'pyNode',
          version: '1.0.0'
        }
      },
      spec: {
        properties: {
          parameters: {
            validation_schema: {
              type: 'object',
              properties: {
                page_id: {
                  default: '',
                  description: 'ID de la page Facebook',
                  type: 'string'
                },
                message: {
                  default: '',
                  description: 'Message à publier',
                  type: 'string'
                },
                image_url: {
                  default: '',
                  description: 'URL d’une image à joindre',
                  type: 'string'
                }
              },
              required: ['page_id', 'message']
            }
          }
        }
      }
    }
  },
  {
    id: uuid(),
    image: 'pyvvo/vscode:latest',
    node_def: {
      api_version: 'core.oam.dev/v1beta1',
      kind: 'ComponentDefinition',
      metadata: {
        name: 'vscode',
        annotations: {
          description: 'Interaction avec Visual Studio Code',
          label: 'VSCode',
          icon: 'https://cdn.freebiesupply.com/logos/large/2x/visual-studio-code-logo-svg-vector.svg',
          color: '#007ACC',
          ui: 'pyNode',
          version: '1.0.0'
        }
      },
      spec: {
        properties: {
          parameters: {
            validation_schema: {
              type: 'object',
              properties: {
                workspace: {
                  default: '',
                  description: 'Chemin du workspace VSCode',
                  type: 'string'
                },
                command: {
                  default: '',
                  description: 'Commande à exécuter dans VSCode',
                  type: 'string'
                }
              },
              required: ['workspace', 'command']
            }
          }
        }
      }
    }
  },
  {
    id: uuid(),
    image: 'pyvvo/wait:latest',
    node_def: {
      api_version: 'core.oam.dev/v1beta1',
      kind: 'ComponentDefinition',
      metadata: {
        name: 'wait',
        annotations: {
          description: 'Pause dans le workflow',
          label: 'Wait',
          icon: 'https://cdn-icons-png.flaticon.com/512/4181/4181163.png',
          color: '#f43378',
          ui: 'pyNode',
          version: '1.0.0'
        }
      },
      spec: {
        properties: {
          parameters: {
            validation_schema: {
              type: 'object',
              properties: {
                duration: {
                  default: 5,
                  description: 'Durée d’attente en secondes',
                  type: 'integer'
                }
              },
              required: ['duration']
            }
          }
        }
      }
    }
  },
  {
    id: uuid(),
    image: 'pyvvo/edit-fields:latest',
    node_def: {
      api_version: 'core.oam.dev/v1beta1',
      kind: 'ComponentDefinition',
      metadata: {
        name: 'edit-fields',
        annotations: {
          description: 'Modification de champs dynamiques',
          label: 'Edit Fields',
          icon: 'https://cdn-icons-png.flaticon.com/512/2344/2344200.png',
          color: '#b163ff',
          ui: 'pyNode',
          version: '1.0.0'
        }
      },
      spec: {
        properties: {
          parameters: {
            validation_schema: {
              type: 'object',
              properties: {
                field_name: {
                  default: '',
                  description: 'Nom du champ à modifier',
                  type: 'string'
                },
                new_value: {
                  default: '',
                  description: 'Nouvelle valeur du champ',
                  type: 'string'
                }
              },
              required: ['field_name', 'new_value']
            }
          }
        }
      }
    }
  }
];

export const parseNodes = (data: INodeModel[]) => {
  const parsedNodes: IPyNode[] = data.map((node) => {
    const metadata = node.node_def.metadata;
    const annotations = metadata.annotations;
    const parameters =
      node.node_def.spec.properties.parameters.validation_schema.properties;

    const parsedParameters = Object.keys(parameters).reduce(
      (acc, key) => {
        acc[key] = {
          value: parameters[key]?.default ?? '',
          type: parameters[key]?.type ?? ''
        };
        return acc;
      },
      {} as Record<string, any>
    );

    return {
      id: node.id,
      type: 'pyNode',
      data: {
        name: metadata.name,
        label: annotations.label,
        icon: annotations.icon,
        color: annotations.color,
        image: node.image,
        parameters: parsedParameters,
        actions: []
      }
    };
  });
  return parsedNodes;
};
