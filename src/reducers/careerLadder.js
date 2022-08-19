import { careerLadderConstants } from '../constants/storeConstants'

const initialState = {
  isLoading: false,
  maxLadderSteps: 10, 
  minLadderSteps: 6, 
  careerPathOptions: [
    {
      id: 1,
      name: 'SW Development Engineer'
    },
    {
      id: 2,
      name: 'SW Engineering Manager'
    },
    {
      id: 3,
      name: 'Product Designer'
    },
    {
      id: 4,
      name: 'Product Manager'
    },
    {
      id: 5,
      name: 'Customer Success'
    }
  ],
  careerLadderData: [
    {
      cp_id: 1,
      data: [
        {
          level_no: 1,
          level_label: 'L1',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 2,
          level_label: 'L2',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 3,
          level_label: 'L3',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 4,
          level_label: 'L4',
          level_title: 'Senior SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 5,
          level_label: 'L5',
          level_title: 'Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 6,
          level_label: 'L6',
          level_title: 'Senior Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        }
      ]
    },
    {
      cp_id: 2,
      data: [
        {
          level_no: 1,
          level_label: 'L1',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 2,
          level_label: 'L2',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 3,
          level_label: 'L3',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 4,
          level_label: 'L4',
          level_title: 'Senior SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 5,
          level_label: 'L5',
          level_title: 'Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 6,
          level_label: 'L6',
          level_title: 'Senior Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        }
      ]
    },
    {
      cp_id: 3,
      data: [
        {
          level_no: 1,
          level_label: 'L1',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 2,
          level_label: 'L2',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 3,
          level_label: 'L3',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 4,
          level_label: 'L4',
          level_title: 'Senior SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 5,
          level_label: 'L5',
          level_title: 'Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 6,
          level_label: 'L6',
          level_title: 'Senior Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        }
      ]
    },
    {
      cp_id: 4,
      data: [
        {
          level_no: 1,
          level_label: 'L1',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 2,
          level_label: 'L2',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 3,
          level_label: 'L3',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 4,
          level_label: 'L4',
          level_title: 'Senior SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 5,
          level_label: 'L5',
          level_title: 'Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 6,
          level_label: 'L6',
          level_title: 'Senior Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        }
      ]
    },
    {
      cp_id: 5,
      data: [
        {
          level_no: 1,
          level_label: 'L1',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 2,
          level_label: 'L2',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 3,
          level_label: 'L3',
          level_title: 'SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 4,
          level_label: 'L4',
          level_title: 'Senior SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 5,
          level_label: 'L5',
          level_title: 'Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        },
        {
          level_no: 6,
          level_label: 'L6',
          level_title: 'Senior Staff SW Engineer',
          details: [
            {
              label: 'Experience',
              content: ''
            },
            {
              label: 'Execution',
              content: ''
            },
            {
              label: 'Craftmanship',
              content: ''
            },
            {
              label: 'Leadership',
              content: ''
            }
          ]
        }
      ]
    }
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {

    case careerLadderConstants.ADD_LADDER:
    case careerLadderConstants.DELETE_LADDER:
      return {
        ...state,
        careerLadderData: [
          ...state.careerLadderData.slice(0, action.index), 
          action.payload, 
          ...state.careerLadderData.slice(action.index+1)
        ]
      }
    
    case careerLadderConstants.EDIT_LADDER:
      return {
        ...state,
        careerLadderData: action.payload
      }

    default:
      return state   
  }
};
