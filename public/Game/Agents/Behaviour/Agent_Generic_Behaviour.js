class Agent_Behaviour {


  constructor(agentObject) {

    this.setupUtilityTasks();

    // // this selector will attempt to locate the player and perform logical operations
    // // once located
    // BehaviourTree.register('playerLocatable', new BehaviourTree.Priority({
    //   title: 'playerLocatable',
    //   nodes: [
    //     'pursueVisiblePlayer',
    //     'pursueAudiblePlayer'
    //   ]
    // }));
    //
    // BehaviourTree.register('navigateAgent', new BehaviourTree.Priority({
    //   title:'navigateAgent',
    //   nodes:[
    //     'playerLocatable',
    //     'playerNotLocatable'
    //   ]
    // }));
    //
    // BehaviourTree.register('mainSequence', new BehaviourTree.Sequence({
    //   title:'mainSequence',
    //   // nodes:['Full','Hungry','Critical']
    //   nodes:[
    //     'navigateAgent',
    //     'attackPlayer'
    //   ]
    // }));
    //
    // // tree
    // this.behaviour = new BehaviourTree({
    //   title: 'agent-behaviour',
    //   tree: 'mainSequence'
    // });

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

  getBehaviour(){
    return this.behaviour;
  }

  setObject(object){
    this.behaviour.getObject(object)
  }

  step(){
    this.behaviour.step();
  }

  setupUtilityTasks(){

    /* prelim agent design
    primary ai will simplyt follow path to player when within a certain radius
    when within range it will open fire at the current players position (simple reflexive)

    states:

    -- Idle (the agent will remain stationary until triggered)
    -- when triggered the player will move towards the players
    -- when in range the player will begin firing but will continue to advance towards
       player
    -- when within min range the player will top moving but keep firing
    -- will return to original position if player dead

    tree:

    Start
      |
    Primary Action Selector
      |          |           |
    Return    Attack      Idle

    Return Sequence
      |             |               |
    isPLayerDead?  hasOldPosition  returnToOldPosition

    Attack Sequence
      |               |              |
    isPlayerAlive   isWithinRange  MoveTo


    */

    // boolean operation to determine if agent is within range of player
    BehaviourTree.register('withinShootingRange', new BehaviourTree.Task({
      title:'withinShootingRange',
      run:function(agent){
        agent.playerWithinFiringRange() ? this.success() : this.fail();
      }
    }));

    // boolean operation to determine if agent is within range of player
    BehaviourTree.register('ShootPlayer', new BehaviourTree.Task({
      title:'ShootPlayer',
      run:function(agent){
        agent.shootPlayer() ? this.success() : this.fail();
      }
    }));

    BehaviourTree.register('attackPlayer', new BehaviourTree.Sequence({
      title:'attackPlayer',
      nodes:[
        'isAgentAlert',
        'playerWithinLineOfSight',
        'withinShootingRange',
        'ShootPlayer'
      ]
    }));

    // Navigation of alerted agent

    // simple task to alert the agent when appropriate
    BehaviourTree.register('alertAgent', new BehaviourTree.Task({
      title:'alertAgent',
      run:function(agent){
        agent.alertAgent();
        this.success();
      }
    }));

    // simple task to alert the agent when appropriate
    BehaviourTree.register('relaxAgent', new BehaviourTree.Task({
      title:'relaxAgent',
      run:function(agent){
        agent.relaxAgent();
        this.success();
      }
    }));



    // simple task to query alert status of agent
    BehaviourTree.register('isAgentAlert', new BehaviourTree.Task({
      title:'isAgentAlert',
      run:function(agent){
        // will fetch alerted state of agent
        agent.isAlerted ? this.success() : this.fail();
      }
    }));

    // GENERALISED FOCUS POSITION PURSUIT

    // this sequence implies an actionable series of steps that will:
    // - attempt to look at the focus position
    // - attempt to move towards the focus position
    BehaviourTree.register('pursueFocusPosition', new BehaviourTree.Sequence({
      title:'pursueFocusPosition',
      nodes:[
        'lookAtFocus',
        'moveToFocus'
      ]
    }));

    // this task will rotate the agent to look at the focus position
    BehaviourTree.register('lookAtFocus', new BehaviourTree.Task({
      title:'lookAtFocus',
      run:function(agent){
        agent.lookAtFocus() ? this.success() : this.fail();
      }
    }));

    // this task will move the agent towards the focus position
    BehaviourTree.register('moveToFocus', new BehaviourTree.Task({
      title:'moveToFocus',
      run:function(agent){
        agent.moveToFocus() ? this.success() : this.fail();
      }
    }));

    // TASKS TO SET AGENT PATHFINDING FOCUS

    // this task will set the agents pathfinding state to player following
    BehaviourTree.register('setAgentPathfindingFocus-PLAYER', new BehaviourTree.Task({
      title:'setAgentPathfindingFocus-PLAYER',
      run:function(agent){
        agent.setAgentPathfindingFocus(AgentPathFindingFocus.PLAYER);
        this.success();
      }
    }));

    // this task will set the agents pathfinding state to near player following
    BehaviourTree.register('setAgentPathfindingFocus-NEARPLAYER', new BehaviourTree.Task({
      title:'setAgentPathfindingFocus-NEARPLAYER',
      run:function(agent){
        agent.setAgentPathfindingFocus(AgentPathFindingFocus.NEARPLAYER);
        this.success();
      }
    }));

    // this task will set the agents pathfinding state to near player following
    BehaviourTree.register('setAgentPathfindingFocus-OLDPLAYER', new BehaviourTree.Task({
      title:'setAgentPathfindingFocus-OLDPLAYER',
      run:function(agent){
        agent.setAgentPathfindingFocus(AgentPathFindingFocus.OLDPLAYER);
        this.success();
      }
    }));

    // this task will set the agents pathfinding state to near player following
    BehaviourTree.register('getAgentPathfindingFocus-OLDPLAYER', new BehaviourTree.Task({
      title:'getAgentPathfindingFocus-OLDPLAYER',
      run:function(agent){
        if(agent.getAgentPathfindingFocus() === AgentPathFindingFocus.OLDPLAYER){
          this.success();
        } else {
          this.fail();
        }
      }
    }));

    // this task will set the agents pathfinding state to wandering
    BehaviourTree.register('setAgentPathfindingFocus-WANDER', new BehaviourTree.Task({
      title:'setAgentPathfindingFocus-WANDER',
      run:function(agent){
        agent.setAgentPathfindingFocus(AgentPathFindingFocus.WANDER);
        this.success();
      }
    }));

    // this task will set the agents pathfinding state to patrolling
    BehaviourTree.register('setAgentPathfindingFocus-PATROL', new BehaviourTree.Task({
      title:'setAgentPathfindingFocus-PATROL',
      run:function(agent){
        agent.setAgentPathfindingFocus(AgentPathFindingFocus.PATROL);
        this.success();
      }
    }));

    /////////////////////////////////////////////////////

    // AGENT WANDER LOGIC

    // this task will check if the agent has arrived at its focus position
    BehaviourTree.register('agentArrivedFocusPosition', new BehaviourTree.Task({
      title:'agentArrivedFocusPosition',
      run:function(agent){
        (agent.agentArrivedFocusPosition() ? this.success() : this.fail());
      }
    }));

    // inverted decorator for simplicity
    BehaviourTree.register('agentNotArrivedFocusPosition', new BehaviourTree.Task({
      title:'agentNotArrivedFocusPosition',
      run:function(agent){
          (!agent.agentArrivedFocusPosition() ? this.success() : this.fail());
      }
    }));

    // this task will check if the agent has reached the focus position and if so
    // will then focus on a new position
    BehaviourTree.register('chooseRandomFocusPosition', new BehaviourTree.Task({
      title:'chooseRandomFocusPosition',
      run:function(agent){

        // agent.setAgentPathfindingFocus(AgentPathFindingFocus.WANDER);

        if(agent.agentArrivedFocusPosition()) {
          agent.setAgentPathfindingFocus(AgentPathFindingFocus.WANDER);
          agent.chooseRandomFocusPosition();
          this.success();
        } else {
          // simply to jump to next behaviour option (move to focus position)
          this.fail()
        }
      }
    }));

    // this selector will attempt to locate the player and perform logical operations
    // once located
    BehaviourTree.register('agentWander', new BehaviourTree.Priority({
      title: 'agentWander',
      nodes: [
        'chooseRandomFocusPosition',
        'pursueFocusPosition'
      ]
    }));


    // this task will update the agents understanding of the player position
    BehaviourTree.register('setLastKnownPlayerPosition', new BehaviourTree.Task({
      title:'setLastKnownPlayerPosition',
      run:function(agent){
        agent.setLastKnownPlayerPosition();
        this.success();
      }
    }));

    // ALERTED AGENT NAVIGATION

    // MOVING NEAR LAST KNOWN POSITION (not implemented yet)

    // MOVING TO LAST KNOWN POSITION

    // this task will check if the player has a last known position
    BehaviourTree.register('canFocusLastKnownPosition', new BehaviourTree.Task({
      title:'canFocusLastKnownPosition',
      run:function(agent){
        agent.canFocusPlayerPosition() ? this.success() : this.fail();
      }
    }));

    BehaviourTree.register('forceKnowLastKnownPosition', new BehaviourTree.Task({
      title:'canFocusLastKnownPosition',
      run:function(agent){
        agent.setLastKnownPlayerPosition() ? this.success() : this.fail();
      }
    }));

    // this task will attempt to move to last known position of the player by:
    // - Checking if not yet arrived at current focus
    // - Checking if focus position is Impossible
    // - setting focus position state
    // - purusing focus position
    BehaviourTree.register('moveToLastKnownPosition', new BehaviourTree.Sequence({
      title:'moveToLastKnownPosition',
      nodes: [
        'agentNotArrivedFocusPosition',
        'canFocusLastKnownPosition',
        'setAgentPathfindingFocus-OLDPLAYER',
        'pursueFocusPosition'
      ]
    }));

    // this task runs when the agent is at the last known position and still
    // cannot find the player. The Agent will remain still and look around
    BehaviourTree.register('agentLookAround', new BehaviourTree.Task({
      title:'agentLookAround',
      run:function(agent){
        agent.lookAround();
        this.success();
      }
    }));



    // this selector implies that the player is not audible or visible but the Agent
    // is alerted so the agent will begin its alerted searching which may be:
    // - moving to the last known position
    // - moving to near the last known position
    // - or simply relax agent as no more is left todo
    BehaviourTree.register('agentAlertedNavigation', new BehaviourTree.Priority({
      title: 'agentAlertedNavigation',
      nodes: [
        'moveToLastKnownPosition',
        // 'moveNearLastKnownPosition',
        // perform some kind of random looking
        // 'agentWander',
        // 'agentLookAround',
        'relaxAgent'
      ]
    }));

    // this sequence will attempt to run assuming the agent is alerted and
    // will either attempt to move to last position or simply wander
    BehaviourTree.register('agentAlerted', new BehaviourTree.Sequence({
      title:'agentAlerted',
      nodes:[
        'isAgentAlert',
        'agentAlertedNavigation'
      ]
    }));

    // // this sequence will attempt to run assuming the agent is not alerted
    // BehaviourTree.register('agentRelaxed', new BehaviourTree.Sequence({
    //   title:'agentRelaxed',
    //   nodes:[
    //     'agentWander'
    //   ]
    // }));
    //
    // // this selector will attempt to locate the player and perform logical operations
    // // once located
    // BehaviourTree.register('playerNotLocatable', new BehaviourTree.Priority({
    //   title: 'playerNotLocatable',
    //   nodes: [
    //     'agentAlerted',
    //     'agentRelaxed'
    //   ]
    // }));

    // this sequence will attempt to determine if the [layer is within the line of
    // sight of the agent and if so will then pursue the player
    BehaviourTree.register('playerInLOS', new BehaviourTree.Sequence({
      title:'playerInLOS',
      nodes:[
        'playerWithinLineOfSight',
        'pursuePlayer'
      ]
    }));

    // boolean operation to determine if agent is within range of player
    BehaviourTree.register('playerWithinAlertRange', new BehaviourTree.Task({
      title:'playerWithinAlertRange',
      run:function(agent){
        agent.playerWithinNavRange() ? this.success() : this.fail();
      }
    }));

    // boolean operation to determine if agent is within range of player
    BehaviourTree.register('playerIsShooting', new BehaviourTree.Task({
      title:'playerIsShooting',
      run:function(agent){
        agent.playerIsShooting() ? this.success() : this.fail();
      }
    }));

    // navigation sequence when player isnt directly visible but is within
    // alert radius and is making noise
    BehaviourTree.register('playerAudible', new BehaviourTree.Sequence({
      title:'playerAudible',
      nodes:[
        'playerWithinAlertRange',
        'playerIsShooting',
        'alertAgent'
      ]
    }));

    // VISUAL DETECTION OF PLAYER

    // this sequence will attempt to locate a audible player and then determine if
    // it is within the LOS (Line of sight) of the agent
    BehaviourTree.register('pursueAudiblePlayer', new BehaviourTree.Sequence({
      title:'pursueAudiblePlayer',
      nodes:[
        'playerAudible',
        'playerInLOS',
        'setLastKnownPlayerPosition',
        'setAgentPathfindingFocus-PLAYER',
        'pursueFocusPosition'
      ]
    }));

    // VISUAL DETECTION OF PLAYER

    // boolean operation to determine if player is within view angle of agent
    // two part inner operation meaning:
    // - within cone angle
    // - within seeing distance
    //
    BehaviourTree.register('playerWithinViewCone', new BehaviourTree.Task({
      title:'playerWithinViewCone',
      run:function(agent){
        agent.playerWithinFieldOfView() ? this.success() : this.fail();
      }
    }));

    // boolean operation to determine if player has any obstacles obstructing
    // its view
    BehaviourTree.register('playerWithinLineOfSight', new BehaviourTree.Task({
      title:'playerWithinLineOfSight',
      run:function(agent){
        agent.playerWithinLineOfSight() ? this.success() : this.fail();
      }
    }));

    // this sequence will attempt to meet two requirements:
    // - the player is witihin its view cone
    // - the player is not obsutructed by obstacles that hide the player
    BehaviourTree.register('playerVisible', new BehaviourTree.Sequence({
      title:'playerVisible',
      nodes:[
        'playerWithinViewCone',
        'playerWithinLineOfSight',
        'setLastKnownPlayerPosition',
        'setAgentPathfindingFocus-PLAYER',
        'alertAgent'
      ]
    }));

    // this task will rotate the agent to look at the players position
    BehaviourTree.register('lookAtPlayer', new BehaviourTree.Task({
      title:'lookAtPlayer',
      run:function(agent){
        agent.lookAtPlayer() ? this.success() : this.fail();
      }
    }));


    BehaviourTree.register('playerProximity', new BehaviourTree.Priority({
      title: 'playerProximity',
      nodes: [
        'withinShootingRange',
        'moveToPlayer'
      ]
    }));

    // this task will move the agent towards the players position
    BehaviourTree.register('moveToPlayer', new BehaviourTree.Task({
      title:'moveToPlayer',
      run:function(agent){
        agent.moveToPlayer() ? this.success() : this.fail();
      }
    }));

    // this sequence implies an actionable series of steps that will:
    // - attempt to look at the player
    // - attempt to move towards the player
    BehaviourTree.register('pursuePlayer', new BehaviourTree.Sequence({
      title:'pursuePlayer',
      nodes:[
        'lookAtPlayer',
        'playerProximity'
      ]
    }));

    // this sequence will attempt to locate a visible player and then pursue it
    BehaviourTree.register('pursueVisiblePlayer', new BehaviourTree.Sequence({
      title:'pursueVisiblePlayer',
      nodes:[
        'playerVisible',
        'pursueFocusPosition'
      ]
    }));

  }

}
