
class Multi_Agent_Behaviour extends Agent_Behaviour {

  constructor(agentObject){

    super(agentObject);

    // this task will alert the agent and broadcast a player seen message to team
    BehaviourTree.register('messagePlayerVisible', new BehaviourTree.Task({
      title:'alertAgentMulti',
      run:function(agent){
        agent.broadcast(AgentMessageType.PLAYER_SEEN);
        this.success();
      }
    }));

    // this task will alert the agent and broadcast a player seen message to team
    BehaviourTree.register('messagePlayerAudible', new BehaviourTree.Task({
      title:'alertAgentMulti',
      run:function(agent){
        agent.broadcast(AgentMessageType.PLAYER_HEARD);
        this.success();
      }
    }));



    // this will be modifed to handle triangulation
    BehaviourTree.register('playerAudibleMulti', new BehaviourTree.Sequence({
      title:'playerAudibleMulti',
      nodes:[
        'playerWithinAlertRange',
        'playerIsShooting',
        'alertAgent',
        'messagePlayerAudible'
      ]
    }));

    // tree
    this.behaviour = new BehaviourTree({
      title: 'agent-behaviour',

      tree: new BehaviourTree.Sequence({

        title:'mainSequenceMulti',
        // nodes:['Full','Hungry','Critical']
        nodes:[

          // navigation sub tree
          new BehaviourTree.Priority({
            title:'navigateAgentMulti',
            nodes:[

              // player location visible and audible
              new BehaviourTree.Priority({
                title: 'playerLocatableMulti',
                nodes: [

                  // task that is fired to check player visibility
                  new BehaviourTree.Sequence({
                    title:'pursueVisiblePlayerMulti',
                    nodes:[

                      // running sequence of checks
                      new BehaviourTree.Sequence({
                        title:'playerVisibleMulti',
                        nodes:[
                          'playerWithinViewCone',
                          'playerWithinLineOfSight',
                          'setLastKnownPlayerPosition',
                          'setAgentPathfindingFocus-PLAYER',
                          'alertAgent',
                          'messagePlayerVisible'
                        ]
                      }),

                      'pursueFocusPosition'
                    ]
                  }),

                  // 'pursueAudiblePlayer',

                  new BehaviourTree.Sequence({
                    title:'pursueAudiblePlayerMulti',
                    nodes:[
                      // this modifed sequence does nothing new but will when
                      // complete
                      'playerAudibleMulti',
                      'messagePlayerAudible',
                      'playerInLOS',
                      'setLastKnownPlayerPosition',
                      'setAgentPathfindingFocus-PLAYER',
                      'pursueFocusPosition'
                    ]
                  })

                ]
              }),

              // this node runs when the player is not visible or audible
              new BehaviourTree.Priority({
                title: 'playerNotLocatableMulti',
                nodes: [

                  'agentAlerted',

                  // this sequence will attempt to run assuming the agent is not alerted
                  new BehaviourTree.Sequence({
                    title:'agentRelaxedMulti',
                    nodes:[
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
