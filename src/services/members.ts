import { addMember as addMemberToStore } from '../store/members';
import client from './db';
import { gql } from 'graphql-request';
import { Member } from '../types/Member';
import store from '../store';

export const getAllMembers = async (): Promise<Member[]> => {
  try {
    const query = gql`
      query GetAllMembersQuery {
        allMembers(_size: 1000) {
          members: data {
            id
            name
            joined
            type
            discord
          }
        }
      }
    `;

    const {
      allMembers: { members },
    } = await client.request<{ allMembers: { members: Member[] } }>(query);

    return members;
  } catch (e) {
    throw e;
  }
};

export const addMember = async (member: Member): Promise<Member> => {
  try {
    const query = gql`
      mutation AddMemberMutation($id: Int!, $name: String!, $type: String!, $joined: String!) {
        member: createMember(data: { id: $id, name: $name, type: $type, joined: $joined }) {
          id
          name
          type
          joined
          discord
        }
      }
    `;

    const { member: savedMember } = await client.request<{ member: Member }, Member>(query, member);
    return savedMember;
  } catch (e) {
    if (e.message.substr(0, 23) === 'Instance is not unique.') {
      return member;
    }
    throw e;
  }
};

export const addMemberIfNew = async (member: Member): Promise<Member> => {
  try {
    if (!store.getState().members[member.id]) {
      const savedMember = await addMember(member);
      store.dispatch(addMemberToStore(savedMember));
      return savedMember;
    }

    return store.getState().members[member.id];
  } catch (e) {
    throw e;
  }
};
