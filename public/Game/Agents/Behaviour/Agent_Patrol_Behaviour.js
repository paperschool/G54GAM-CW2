class Patrol_Agent_Behaviour extends Agent_Behaviour {

  constructor(agentObject){

    super(agentObject);

    // this selector will attempt to locate the player and perform logical operations
    // once located
    BehaviourTree.register('choosePatrolPoint', new BehaviourTree.Task({
      title: 'choosePatrolPoint',
      run:function(agent){

        if(agent.agentArrivedFocusPosition()) {
          agent.setAgentPathfindingFocus(AgentPathFindingFocus.PATROL);
          agent.choosePatrolPoint();
          this.success();
        } else {
          // simply to jump to next behaviour option (move to focus position)
          this.fail()
        }

      }
    }));

    // this selector will attempt to locate the player and perform logical operations
    // once located
    BehaviourTree.register('agentPatrol', new BehaviourTree.Priority({
      title: 'agentPatrol',
      nodes: [
        'choosePatrolPoint',
        'pursueFocusPosition'
      ]
    }));


    // tree
    this.behaviour = new BehaviourTree({
      title: 'agent-behaviour',

      tree: new BehaviourTree.Sequence({

        title:'mainSequence',
        // nodes:['Full','Hungry','Critical']
        nodes:[

          // navigation sub tree
          new BehaviourTree.Priority({
            title:'navigateAgent',
            nodes:[

              // player location visible and audible
              new BehaviourTree.Priority({
                title: 'playerLocatable',
                nodes: [
                  'pursueVisiblePlayer',
                  'pursueAudiblePlayer'
                ]
              }),

              // this node runs when the player is not visible or audible
              new BehaviourTree.Priority({
                title: 'playerNotLocatable',
                nodes: [

                  'agentAlerted',

                  // this sequence will attempt to run assuming the agent is not alerted
                  new BehaviourTree.Sequence({
                    title:'agentRelaxed',
                    nodes:[
                      'agentPatrol',
                      'agentWander'
                    ]
                  })

                ]
              })

            ]
          }),

          // attacking sub tree
          new BehaviourTree.Sequence({
            title:'attackPlayer',
            nodes:[
              'isAgentAlert',
              'playerWithinLineOfSight',
              'withinShootingRange',
              'ShootPlayer'
            ]
          }),

        ]

      })
    });

    this.behaviour.setObject(agentObject);

  }

  step(){
    this.behaviour.step();
  }

}
