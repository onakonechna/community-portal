interface PartnerTeamControllerInterface {
  save(data: any): (result: any) => any;
  getTeams(): (result: any) => any;
}

export default class PartnerTeamController implements PartnerTeamControllerInterface {
  save(data: any) {
    console.log('DAAATAAA1', JSON.stringify(data));
    const { id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          id
        },
      };
    };
  }

  getTeams() {
    return (result: any) => {
      return {
        status: 200,
        payload: result.Items,
      };
    };
  }
}
