import * as _ from 'lodash';

interface ProjectControllerInterface {
  create(data: any): (result: any) => any;
  getCards(data: any): (result: any) => any;
  getById(data: any): (result: any) => any;
  edit(data: any): (result: any) => any;
  updateDisplay(data: any): (result: any) => any;
  upvote(data: any): (result: any) => any;
  downvote(data: any): (result: any) => any;
  delete(data: any): (result: any) => any;
  updateStatus(data: any): (result: any) => any;
  checkOwner(data: any): (result: any) => any;
  checkPledged(data: any): (result: any) => any;
}

function deleteField(object: any, field: string) {
  delete object[field];
  return object;
}

function deleteFieldFromList(array: any[], field: string) {
  array.forEach((object: any) => delete object[field]);
  return array;
}

export default class ProjectController implements ProjectControllerInterface {
  create(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project created successfully',
        },
      };
    };
  }

  getCards(data: any) {
    return (result: any) => {
      if (result.Items) {
        return {
          status: 200,
          payload: result.Items,
        };
      }
      return {
        status: 404,
        payload: { error: 'No project found' },
      };
    };
  }

  returnProjectDetails(data: any) {
    const { project, recommended } = data;
    return () => {
      if (project) {
        return {
          status: 200,
          payload: _.assign(deleteField(project, 'ranked_users'), { recommended }),
        };
      }
      return {
        status: 404,
        payload: { error: 'Project not found' },
      };
    };
  }

  edit(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project edited successfully',
        },
      };
    };
  }

  updateDisplay(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project status updated successfully',
        },
      };
    };
  }

  upvote(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project upvoted successfully',
        },
      };
    };
  }

  downvote(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project downvoted successfully',
        },
      };
    };
  }

  delete(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project deleted successfully',
        },
      };
    };
  }

  // intermediary controllers
  getById(data: any) {
    return (result: any) => result.Item ? { project: result.Item } : {};
  }

  updateStatus(data: any) {
    // display == true only if status == open after update
    return (result: any) => {
      const { status } = result.Attributes;
      return {
        display: String(status === 'open'),
      };
    };
  }

  // check if user is owner of project
  checkOwner(data: any) {
    const { user_id } = data;
    return (result: any) => {
      const flag = { is_owner: false };
      if (result.Item && result.Item.owner === user_id) {
        flag.is_owner = true;
      }
      return flag;
    };
  }

  // check if pledged would exceed total
  checkPledged(data: any) {
    return (result: any) => {
      const flag = { will_exceed: false };
      if (result.Item) {
        const { pledged, estimated } = result.Item;
        if (pledged + 1 > estimated) {
          throw 'Total number of pledgers exceed estimated number of pledgers required';
        }
      } else {
        throw 'Project not found';
      }
      return {};
    };
  }

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
