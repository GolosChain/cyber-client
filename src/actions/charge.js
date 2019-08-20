import Basic from './basic';

export default class Charge extends Basic {
  _contractAccount = 'gls.charge';
  _contractActions = ['setrestorer', 'use', 'usenotifygt', 'usenotifylt', 'useandstore', 'removestored'];
}
